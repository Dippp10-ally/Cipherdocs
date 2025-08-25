import { uploadToIPFS } from './ipfsService';

/**
 * Secure IPFS-based printing service that prevents direct downloads
 * Files are encrypted and stored on IPFS, only print agents can decrypt
 */

interface PrintJob {
  jobId: string;
  uploaderId: string;
  shopId: string;
  cid: string;
  aesKey: Uint8Array;
  iv: Uint8Array;
  tag: Uint8Array;
  wrappedKey: string;
  previewUrl?: string;
  status: 'pending' | 'dispatched' | 'printed' | 'failed' | 'expired';
  createdAt: Date;
  ttl: number; // seconds
  metadata: {
    filename: string;
    pages: number;
    documentType: string;
    printOptions?: {
      duplex: boolean;
      copies: number;
      quality: 'draft' | 'normal' | 'high';
    };
  };
}

interface ShopAgent {
  agentId: string;
  shopId: string;
  publicKey: string;
  status: 'online' | 'offline';
  lastSeen: Date;
  printerInfo?: {
    model: string;
    driver: string;
    capabilities: string[];
  };
}

class SecureIPFSPrintService {
  private static jobs = new Map<string, PrintJob>();
  private static agents = new Map<string, ShopAgent>();

  /**
   * Generate AES-256-GCM key for encryption
   */
  private static generateAESKey(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(32));
  }

  /**
   * Generate random IV for GCM
   */
  private static generateIV(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(12));
  }

  /**
   * Encrypt file with AES-256-GCM
   */
  private static async encryptFile(fileBuffer: ArrayBuffer, key: Uint8Array, iv: Uint8Array): Promise<{ encrypted: ArrayBuffer; tag: Uint8Array }> {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const result = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      fileBuffer
    );

    // Extract tag (last 16 bytes) and encrypted data
    const encrypted = result.slice(0, -16);
    const tag = new Uint8Array(result.slice(-16));

    return { encrypted, tag };
  }

  /**
   * Create low-resolution watermarked preview
   */
  private static async createWatermarkedPreview(file: File, jobId: string, shopId: string): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Create a low-res preview (400x600 max)
      canvas.width = 400;
      canvas.height = 600;
      
      // Fill with document preview pattern
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add document icon/preview
      ctx.fillStyle = '#6c757d';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('📄 DOCUMENT PREVIEW', canvas.width / 2, 50);
      ctx.fillText(`(${file.name})`, canvas.width / 2, 80);
      
      // Add security watermarks
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#dc3545';
      
      // Diagonal watermarks
      for (let y = 100; y < canvas.height; y += 120) {
        for (let x = -50; x < canvas.width + 100; x += 200) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-Math.PI / 6);
          ctx.fillText('PREVIEW ONLY', 0, 0);
          ctx.fillText(`Job: ${jobId.slice(-6)}`, 0, 30);
          ctx.fillText(`Shop: ${shopId}`, 0, 60);
          ctx.restore();
        }
      }
      
      ctx.restore();
      
      // Add timestamp
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.fillText(`Generated: ${new Date().toLocaleString()}`, canvas.width / 2, canvas.height - 20);
      
      // Convert to blob URL
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(URL.createObjectURL(blob));
        } else {
          resolve('');
        }
      }, 'image/png', 0.6); // Low quality for preview
    });
  }

  /**
   * Mock RSA encryption for demo (in production, use actual RSA-OAEP)
   */
  private static mockWrapKey(aesKey: Uint8Array, agentPublicKey: string): string {
    // In production, use RSA-OAEP to encrypt the AES key
    // For demo, just base64 encode with agent ID
    const keyData = Array.from(aesKey).map(b => b.toString(16).padStart(2, '0')).join('');
    return btoa(`${agentPublicKey}:${keyData}`);
  }

  /**
   * Upload and encrypt file for secure printing
   */
  static async uploadForSecurePrint(
    file: File,
    uploaderId: string,
    shopId: string,
    printOptions?: PrintJob['metadata']['printOptions']
  ): Promise<{ jobId: string; previewUrl: string; success: boolean; error?: string }> {
    try {
      // Generate job ID
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      
      // Generate encryption keys
      const aesKey = this.generateAESKey();
      const iv = this.generateIV();
      
      // Read file as array buffer
      const fileBuffer = await file.arrayBuffer();
      
      // Encrypt the file
      const { encrypted, tag } = await this.encryptFile(fileBuffer, aesKey, iv);
      
      // Create encrypted payload: IV + TAG + ENCRYPTED_DATA
      const payload = new Uint8Array(iv.length + tag.length + encrypted.byteLength);
      payload.set(iv, 0);
      payload.set(tag, iv.length);
      payload.set(new Uint8Array(encrypted), iv.length + tag.length);
      
      // Upload encrypted payload to IPFS
      const encryptedFile = new File([payload], `encrypted_${file.name}`, { type: 'application/octet-stream' });
      const cid = await uploadToIPFS(encryptedFile);
      
      // Get agent for shop (mock for demo)
      const agent = this.agents.get(shopId) || {
        agentId: `agent_${shopId}`,
        shopId,
        publicKey: `pubkey_${shopId}`,
        status: 'online' as const,
        lastSeen: new Date()
      };
      
      // Wrap AES key with agent's public key
      const wrappedKey = this.mockWrapKey(aesKey, agent.publicKey);
      
      // Create watermarked preview
      const previewUrl = await this.createWatermarkedPreview(file, jobId, shopId);
      
      // Create print job
      const printJob: PrintJob = {
        jobId,
        uploaderId,
        shopId,
        cid,
        aesKey,
        iv,
        tag,
        wrappedKey,
        previewUrl,
        status: 'pending',
        createdAt: new Date(),
        ttl: 3600, // 1 hour
        metadata: {
          filename: file.name,
          pages: 1, // In production, extract from PDF
          documentType: file.type,
          printOptions: printOptions || {
            duplex: false,
            copies: 1,
            quality: 'normal'
          }
        }
      };
      
      // Store job
      this.jobs.set(jobId, printJob);
      
      console.log(`Created secure print job: ${jobId}`);
      console.log(`📁 Encrypted file stored on IPFS: ${cid}`);
      console.log(`🔑 AES key wrapped for agent: ${agent.agentId}`);
      
      return {
        jobId,
        previewUrl,
        success: true
      };
      
    } catch (error) {
      console.error('❌ Failed to create secure print job:', error);
      return {
        jobId: '',
        previewUrl: '',
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Dispatch job to agent for printing
   */
  static async dispatchPrintJob(jobId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const job = this.jobs.get(jobId);
      if (!job) {
        return { success: false, error: 'Job not found' };
      }
      
      if (job.status !== 'pending') {
        return { success: false, error: `Job already ${job.status}` };
      }
      
      // Check if job expired
      const now = new Date();
      const expiry = new Date(job.createdAt.getTime() + job.ttl * 1000);
      if (now > expiry) {
        job.status = 'expired';
        return { success: false, error: 'Job expired' };
      }
      
      // In production, send via WebSocket to agent
      const agentPayload = {
        type: 'printJob',
        jobId: job.jobId,
        cid: job.cid,
        wrappedKey: job.wrappedKey,
        metadata: job.metadata
      };
      
      console.log(`Dispatching print job to agent:`, agentPayload);
      
      // Mock agent dispatch (in production, use WebSocket)
      setTimeout(() => {
        this.mockAgentPrintComplete(jobId);
      }, 5000); // Simulate 5 second print time
      
      job.status = 'dispatched';
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Failed to dispatch print job:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Dispatch failed'
      };
    }
  }

  /**
   * Mock agent print completion (for demo)
   */
  private static mockAgentPrintComplete(jobId: string): void {
    const job = this.jobs.get(jobId);
    if (job && job.status === 'dispatched') {
      job.status = 'printed';
      console.log(`Agent completed print job: ${jobId}`);
      
      // In production, agent would send signed attestation
      const attestation = {
        jobId,
        status: 'printed',
        timestamp: new Date(),
        pagesPrinted: job.metadata.pages,
        agentSignature: `mock_signature_${jobId}`,
        printerInfo: 'HP LaserJet Pro 400'
      };
      
      console.log('Print attestation received:', attestation);
    }
  }

  /**
   * Get job status
   */
  static getJobStatus(jobId: string): PrintJob | null {
    return this.jobs.get(jobId) || null;
  }

  /**
   * Get all jobs for a user
   */
  static getUserJobs(uploaderId: string): PrintJob[] {
    return Array.from(this.jobs.values()).filter(job => job.uploaderId === uploaderId);
  }

  /**
   * Clean up expired jobs
   */
  static cleanupExpiredJobs(): number {
    const now = new Date();
    let cleaned = 0;
    
    this.jobs.forEach((job, jobId) => {
      const expiry = new Date(job.createdAt.getTime() + job.ttl * 1000);
      if (now > expiry) {
        this.jobs.delete(jobId);
        if (job.previewUrl) {
          URL.revokeObjectURL(job.previewUrl);
        }
        cleaned++;
      }
    });
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} expired print jobs`);
    }
    
    return cleaned;
  }

  /**
   * Register a shop agent
   */
  static registerAgent(shopId: string, publicKey: string, printerInfo?: ShopAgent['printerInfo']): boolean {
    try {
      const agent: ShopAgent = {
        agentId: `agent_${shopId}`,
        shopId,
        publicKey,
        status: 'online',
        lastSeen: new Date(),
        printerInfo
      };
      
      this.agents.set(shopId, agent);
      console.log(`🤖 Registered agent for shop: ${shopId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to register agent:', error);
      return false;
    }
  }
}

export default SecureIPFSPrintService;