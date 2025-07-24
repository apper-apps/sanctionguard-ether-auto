import searchHistoryData from "@/services/mockData/searchHistory.json";
// API Configuration
const API_BASE_URL = 'https://api.dilisense.com/v1';
const API_KEY = 'gV9wIVW2LAemLdktlhzm6Y6I1Z6Lptnkga6TnC30';

// Mock data for development and testing
const mockSanctionEntities = [
  {
    id: "entity_001",
    name: "Vladimir Vladimirovich Putin",
    aliases: ["Vladimir Putin", "V. Putin", "President Putin"],
    riskScore: 100,
    sanctionPrograms: ["US OFAC SDN", "EU Sanctions", "UK Sanctions"],
    dateAdded: "2022-02-26",
    country: "Russia",
    identifiers: {
      dateOfBirth: "1952-10-07",
      placeOfBirth: "Leningrad, USSR",
      nationality: "Russian",
      position: "President of Russia"
    },
    details: {
      description: "President of the Russian Federation",
      sanctionReason: "Responsible for ordering the invasion of Ukraine",
      additionalInfo: "Head of state involved in destabilizing activities"
    }
  },
  {
    id: "entity_002", 
    name: "Sberbank of Russia",
    aliases: ["Sberbank", "PJSC Sberbank", "Sberbank Russia"],
    riskScore: 85,
    sanctionPrograms: ["US OFAC SDN", "UK Sanctions"],
    dateAdded: "2022-02-26",
    country: "Russia",
    identifiers: {
      swiftCode: "SABRRUMM",
      registrationNumber: "1481394",
      entityType: "Financial Institution"
    },
    details: {
      description: "Largest bank in Russia and Eastern Europe",
      sanctionReason: "Supporting Russian government activities",
      additionalInfo: "State-controlled banking institution"
    }
  }
];

class SanctionsService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.searchHistory = this.loadSearchHistory();
    
    // Listen for online/offline status changes
    window.addEventListener('online', () => {
      this.isOnline = true;
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  loadSearchHistory() {
    try {
      const saved = localStorage.getItem('sanctionsSearchHistory');
      return saved ? JSON.parse(saved) : searchHistoryData || [];
    } catch (error) {
      console.warn('Failed to load search history from localStorage:', error);
      return searchHistoryData || [];
    }
  }

  saveSearchHistory() {
    try {
      localStorage.setItem('sanctionsSearchHistory', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.warn('Failed to save search history to localStorage:', error);
}
  }

async searchSanctions(query) {
    if (!query || query.trim() === '') {
      console.warn('Empty search query provided');
      return {
        success: false,
        error: 'Search query is required',
        entities: [],
        totalCount: 0,
        searchTime: 0
      };
    }

    const normalizedQuery = query.trim().toLowerCase();
    
    // Add to search history
    this.addToSearchHistory(query);

try {
      if (this.isOnline) {
        // Try real API first with enhanced error handling and debugging
        console.log(`Making API request to: ${API_BASE_URL}/sanctions/search?q=${encodeURIComponent(query)}`);
        console.log(`Using API Key: ${API_KEY.substring(0, 8)}...`);
        
        const response = await this.makeApiRequest(`/sanctions/search?q=${encodeURIComponent(query)}`);
        
        if (response.ok) {
          const data = await response.json();
          const entities = data.results || data.entities || [];
          
          console.log(`API Success: Received ${entities.length} entities`);
          
          return {
            success: true,
            entities: entities,
            totalCount: data.totalCount || entities.length,
            searchTime: data.searchTime || Math.random() * 2 + 0.5,
            source: 'api',
            apiStatus: 'connected'
          };
        } else {
          // Enhanced error handling with detailed response information
          let errorMessage;
          let errorData = {};
          
          try {
            errorData = await response.json();
            errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`;
          } catch (jsonError) {
            errorMessage = `HTTP ${response.status} ${response.statusText}`;
          }
          
          console.error(`API Error Response:`, {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            errorData
          });
          
          if (response.status === 401) {
            throw new Error('API authentication failed - invalid API key');
          } else if (response.status === 403) {
            throw new Error('API access forbidden - check API permissions');
          } else if (response.status === 404) {
            throw new Error('API endpoint not found - service may be unavailable');
          } else if (response.status >= 500) {
            throw new Error(`API server error (${response.status}) - service temporarily unavailable`);
          } else {
            throw new Error(`API error (${response.status}): ${errorMessage}`);
          }
        }
      } else {
        throw new Error('No internet connection available');
      }
} catch (error) {
      // Enhanced error logging with proper error message extraction
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      
      console.error('API request failed with detailed error:', {
        message: errorMessage,
        name: error?.name || 'UnknownError',
        stack: error?.stack,
        apiUrl: `${API_BASE_URL}/sanctions/search`,
        apiKey: `${API_KEY.substring(0, 8)}...`,
        query: query,
        isOnline: this.isOnline,
        fullError: error,
        errorType: typeof error
      });
      
      // Determine fallback reason with more specific messaging
      let fallbackReason = errorMessage;
      if (errorMessage.includes('fetch')) {
        fallbackReason = 'Network error - unable to reach API server (possible CORS issue)';
      } else if (errorMessage.includes('timeout')) {
        fallbackReason = 'API request timed out - server not responding';
      } else if (errorMessage.includes('authentication')) {
        fallbackReason = 'API authentication failed - check API key';
      }
      
      // Fallback to mock data with search filtering
      const mockResults = mockSanctionEntities.filter(entity => {
        const searchableText = [
          entity.name,
          ...(entity.aliases || []),
          entity.country,
          ...(entity.sanctionPrograms || [])
        ].join(' ').toLowerCase();
        
        return searchableText.includes(normalizedQuery);
      });

      return {
        success: true,
        entities: mockResults,
        totalCount: mockResults.length,
        searchTime: Math.random() * 2 + 0.5,
        source: 'mock',
        fallbackReason: fallbackReason,
        apiStatus: 'error',
        originalError: errorMessage // Always store as string
      };
    }
  }

async getEntityDetails(entityId) {
    if (!entityId) {
      return {
        success: false,
        error: 'Entity ID is required',
        data: null
      };
    }

    try {
      if (this.isOnline) {
        // Try real API first
        const response = await this.makeApiRequest(`/sanctions/entity/${entityId}`);
        
        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            data: data.entity || data,
            source: 'api'
          };
        } else {
          // Handle API error responses
          const errorData = await response.json().catch(() => ({}));
          console.warn(`API returned ${response.status}: ${errorData.message || response.statusText}`);
          throw new Error(errorData.message || `API error: ${response.status}`);
        }
      } else {
        throw new Error('No internet connection available');
      }
} catch (error) {
      // Enhanced error handling with proper message extraction
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      
      console.warn('API request failed, falling back to mock data:', {
        message: errorMessage,
        entityId: entityId,
        fullError: error,
        errorType: typeof error
      });
      
      // Fallback to mock data
      const mockEntity = mockSanctionEntities.find(entity => entity.id === entityId);
      
      if (mockEntity) {
        return {
          success: true,
          data: mockEntity,
          source: 'mock',
          fallbackReason: errorMessage // Always string
        };
      }
      
      return {
        success: false,
        error: 'Entity not found in any data source',
        data: null,
        originalError: errorMessage // Store error message as string
      };
    }
  }

  addToSearchHistory(query) {
    if (!query || typeof query !== 'string') return;

    const normalizedQuery = query.trim();
    if (normalizedQuery.length === 0) return;

    // Remove existing entry if it exists
    this.searchHistory = this.searchHistory.filter(item => 
      item.query.toLowerCase() !== normalizedQuery.toLowerCase()
    );

    // Add new entry at the beginning
    this.searchHistory.unshift({
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      query: normalizedQuery,
      timestamp: new Date().toISOString(),
      type: 'manual'
    });

    // Keep only last 50 searches
    this.searchHistory = this.searchHistory.slice(0, 50);
    
    // Save to localStorage
    this.saveSearchHistory();
  }

  getSearchHistory() {
    return [...this.searchHistory]; // Return a copy
  }

  clearSearchHistory() {
    this.searchHistory = [];
    this.saveSearchHistory();
    return true;
  }

async checkApiStatus() {
    if (!this.isOnline) {
      return {
        status: 'offline',
        message: 'No internet connection',
        isConnected: false
      };
    }

try {
      console.log(`Checking API health at: ${API_BASE_URL}/health`);
      const startTime = performance.now();
      const response = await this.makeApiRequest('/health', { timeout: 5000 });
      const responseTime = Math.round(performance.now() - startTime);
      
      if (response.ok) {
        const healthData = await response.json().catch(() => ({}));
        console.log('API health check successful:', healthData);
        
        return {
          status: 'connected',
          message: `API operational ${healthData.version ? `(v${healthData.version})` : ''} - ${responseTime}ms`,
          isConnected: true,
          responseTime: responseTime,
          details: {
            endpoint: `${API_BASE_URL}/health`,
            apiKey: `${API_KEY.substring(0, 8)}...`,
            timestamp: new Date().toISOString()
          }
        };
      } else {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (jsonError) {
          // Response not JSON, use status text
        }
        
        console.error('API health check failed:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          responseTime
        });
        
        let message = `API error (${response.status})`;
        if (response.status === 401) {
          message = 'Authentication failed - invalid API key';
        } else if (response.status === 403) {
          message = 'Access forbidden - check API permissions';
        } else if (response.status === 404) {
          message = 'Health endpoint not found - API may be down';
        } else if (response.status >= 500) {
          message = `Server error (${response.status}) - API temporarily unavailable`;
        } else if (errorData.message) {
          message = `${errorData.message} (${response.status})`;
        }
        
        return {
          status: 'error',
          message: message,
          isConnected: false,
          details: {
            httpStatus: response.status,
            statusText: response.statusText,
            responseTime: responseTime,
            endpoint: `${API_BASE_URL}/health`
          }
        };
      }
} catch (error) {
      // Enhanced error handling with proper error message extraction
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      
      console.error('API health check exception:', {
        message: errorMessage,
        name: error?.name || 'UnknownError',
        endpoint: `${API_BASE_URL}/health`,
        fullError: error,
        errorType: typeof error
      });
      
      let userFriendlyMessage = 'Failed to connect to API';
      let details = { 
        error: errorMessage,
        originalError: errorMessage // Always store as string
      };
      
      if (errorMessage === 'Request timeout') {
        userFriendlyMessage = 'API health check timed out (>5s)';
        details.timeout = true;
      } else if (errorMessage.includes('NetworkError') || errorMessage.includes('fetch')) {
        userFriendlyMessage = 'Network error - API server unreachable (check CORS/firewall)';
        details.networkError = true;
      } else if (error?.name === 'TypeError' && errorMessage.includes('Failed to fetch')) {
        userFriendlyMessage = 'CORS error - API server blocking browser requests';
        details.corsError = true;
      } else if (errorMessage.includes('SSL') || errorMessage.includes('certificate')) {
        userFriendlyMessage = 'SSL/Certificate error - secure connection failed';
        details.sslError = true;
      } else {
        userFriendlyMessage = `Connection failed: ${errorMessage}`;
      }
      
      return {
        status: 'error',
        message: userFriendlyMessage,
        isConnected: false,
        details: {
          ...details,
          endpoint: `${API_BASE_URL}/health`,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async makeApiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const { timeout = 10000, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          ...fetchOptions.headers
        },
        signal: controller.signal,
        ...fetchOptions
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }
}

// Export singleton instance
const sanctionsService = new SanctionsService();
export default sanctionsService;