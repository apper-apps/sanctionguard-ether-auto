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
        // Try real API first with proper error handling
        const response = await this.makeApiRequest(`/sanctions/search?q=${encodeURIComponent(query)}`);
        
        if (response.ok) {
          const data = await response.json();
          const entities = data.results || data.entities || [];
          
          return {
            success: true,
            entities: entities,
            totalCount: data.totalCount || entities.length,
            searchTime: data.searchTime || Math.random() * 2 + 0.5,
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
      console.warn('API request failed, falling back to mock data:', error.message);
      
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
        fallbackReason: error.message
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
      console.warn('API request failed, falling back to mock data:', error.message);
      
      // Fallback to mock data
      const mockEntity = mockSanctionEntities.find(entity => entity.id === entityId);
      
      if (mockEntity) {
        return {
          success: true,
          data: mockEntity,
          source: 'mock',
          fallbackReason: error.message
        };
      }
      
      return {
        success: false,
        error: 'Entity not found in any data source',
        data: null
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
      const response = await this.makeApiRequest('/health', { timeout: 5000 });
      
      if (response.ok) {
        const healthData = await response.json().catch(() => ({}));
        return {
          status: 'connected',
          message: healthData.message || 'API is operational',
          isConnected: true,
          responseTime: healthData.responseTime
        };
      } else {
        const errorData = await response.json().catch(() => ({}));
        return {
          status: 'error',
          message: errorData.message || `API returned ${response.status} ${response.statusText}`,
          isConnected: false
        };
      }
    } catch (error) {
      let errorMessage = 'Failed to connect to API';
      
      if (error.message === 'Request timeout') {
        errorMessage = 'API request timed out';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network error - unable to reach API';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      return {
        status: 'error',
        message: errorMessage,
        isConnected: false
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