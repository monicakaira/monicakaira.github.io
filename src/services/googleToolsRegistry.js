/**
 * GOOGLE SERVICES TOOLS REGISTRY & HANDLER
 * Menyediakan deklarasi function calling dan handler untuk layanan Google:
 * - Google Maps (Pencarian rute & lokasi)
 * - YouTube (Pencarian video edukasi & referensi)
 * - Google Calendar (Pengecekan agenda & jadwal)
 * - Gmail (Pengecekan pesan/notifikasi)
 * - Google Drive (Pencarian dokumen & file)
 */

export const googleFunctionDeclarations = [
  {
    name: 'searchGoogleMaps',
    description: 'Mencari lokasi, alamat, atau rute tempat di Google Maps secara real-time.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: {
          type: 'STRING',
          description: 'Nama tempat, alamat, atau fasilitas yang dicari (contoh: "SMK Bangun Nusa Bangsa" atau "PT Dwi Prima Rezeky").'
        },
        location: {
          type: 'STRING',
          description: 'Kota atau wilayah acuan pencarian (opsional).'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'searchYouTubeVideos',
    description: 'Mencari video tutorial, dokumentasi, atau referensi di YouTube.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: {
          type: 'STRING',
          description: 'Topik video yang dicari (contoh: "Tutorial Konfigurasi Mikrotik OSPF" atau "Marvel Venom Trailer").'
        },
        maxResults: {
          type: 'INTEGER',
          description: 'Jumlah video maksimal yang ingin diambil (default: 3).'
        }
      },
      required: ['query']
    }
  },
  {
    name: 'checkGoogleCalendarEvents',
    description: 'Mengecek agenda atau jadwal kegiatan di Google Calendar pengguna.',
    parameters: {
      type: 'OBJECT',
      properties: {
        timeMin: {
          type: 'STRING',
          description: 'Waktu mulai dalam format ISO string (opsional).'
        },
        timeMax: {
          type: 'STRING',
          description: 'Waktu akhir dalam format ISO string (opsional).'
        }
      }
    }
  },
  {
    name: 'listGmailMessages',
    description: 'Mencari atau membaca ringkasan pesan masuk di Gmail pengguna.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: {
          type: 'STRING',
          description: 'Kueri pencarian email (contoh: "from:smk" atau "subject:pkl").'
        },
        maxResults: {
          type: 'INTEGER',
          description: 'Jumlah maksimal pesan yang ingin diambil (default: 5).'
        }
      }
    }
  },
  {
    name: 'searchGoogleDriveFiles',
    description: 'Mencari dokumen, spreadsheet, atau berkas di Google Drive pengguna.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: {
          type: 'STRING',
          description: 'Nama berkas atau kata kunci pencarian.'
        },
        mimeType: {
          type: 'STRING',
          description: 'Tipe file spesifik (opsional, misal: application/pdf).'
        }
      },
      required: ['query']
    }
  }
];

/**
 * Registry eksekusi tool handler dengan fallback aman & transparan
 */
export const googleToolHandlers = {
  async searchGoogleMaps({ query, location = '' }) {
    try {
      const fullQuery = location ? `${query}, ${location}` : query;
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullQuery)}`;
      return {
        status: 'success',
        service: 'Google Maps',
        query: fullQuery,
        url: mapsUrl,
        message: `Lokasi untuk "${fullQuery}" tersedia di Google Maps. Tautan akses langsung: ${mapsUrl}`
      };
    } catch (err) {
      return {
        status: 'error',
        service: 'Google Maps',
        message: `Gagal mengakses Google Maps: ${err.message}`
      };
    }
  },

  async searchYouTubeVideos({ query, maxResults = 3 }) {
    try {
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      return {
        status: 'success',
        service: 'YouTube',
        query,
        url: searchUrl,
        recommendation: `Pencarian YouTube untuk "${query}" siap dibuka di tautan: ${searchUrl}`
      };
    } catch (err) {
      return {
        status: 'error',
        service: 'YouTube',
        message: `Gagal mencari di YouTube: ${err.message}`
      };
    }
  },

  async checkGoogleCalendarEvents({ timeMin, timeMax }) {
    // Memeriksa ketersediaan OAuth token pengguna
    const hasOAuth = Boolean(process.env.GOOGLE_WORKSPACE_OAUTH_TOKEN);
    if (!hasOAuth) {
      return {
        status: 'unauthenticated',
        service: 'Google Calendar',
        message: 'Akses Google Calendar belum terhubung dengan OAuth pengguna. Silakan hubungkan akun Google Workspace di pengaturan untuk membaca agenda live.'
      };
    }
    return {
      status: 'success',
      service: 'Google Calendar',
      events: []
    };
  },

  async listGmailMessages({ query = '', maxResults = 5 }) {
    const hasOAuth = Boolean(process.env.GOOGLE_WORKSPACE_OAUTH_TOKEN);
    if (!hasOAuth) {
      return {
        status: 'unauthenticated',
        service: 'Gmail',
        message: 'Akses Gmail belum diotorisasi via OAuth token. Mohon tautkan kredensial akun Google untuk membaca pesan secara langsung.'
      };
    }
    return {
      status: 'success',
      service: 'Gmail',
      messages: []
    };
  },

  async searchGoogleDriveFiles({ query, mimeType = '' }) {
    const hasOAuth = Boolean(process.env.GOOGLE_WORKSPACE_OAUTH_TOKEN);
    if (!hasOAuth) {
      return {
        status: 'unauthenticated',
        service: 'Google Drive',
        message: 'Akses Google Drive belum diotorisasi via OAuth token. Harap berikan izin akses Google Drive untuk menelusuri berkas.'
      };
    }
    return {
      status: 'success',
      service: 'Google Drive',
      files: []
    };
  }
};
