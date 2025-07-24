import searchHistoryData from "@/services/mockData/searchHistory.json";

const API_BASE_URL = "https://api.dilisense.com/v1";
const API_KEY = "gV9wIVW2LAemLdktlhzm6Y6I1Z6Lptnkga6TnC30";

// Mock data for development
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
      passportNumber: "720006154",
      dateOfBirth: "1952-10-07",
      placeOfBirth: "Saint Petersburg, Russia"
    },
    details: {
      reason: "Leading official of the Government of the Russian Federation",
      description: "President of the Russian Federation. Designated for being responsible for directing the policy of the Government of the Russian Federation.",
      programs: [
        {
          name: "US OFAC SDN",
          listingDate: "2022-02-26",
          reference: "UKRAINE-EO13661"
        },
        {
          name: "EU Sanctions",
          listingDate: "2022-02-25",
          reference: "EU No 833/2014"
        }
      ]
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
      registrationNumber: "1027700132195",
      address: "19 Vavilova St, Moscow, Russia"
    },
    details: {
      reason: "Largest financial institution in Russia",
      description: "Public Joint Stock Company Sberbank of Russia, a systemically important financial institution in Russia.",
      programs: [
        {
          name: "US OFAC SDN",
          listingDate: "2022-02-26",
          reference: "UKRAINE-EO14024"
        }
      ]
    }
  }
];

class SanctionsService {
  constructor() {
    this.searchHistory = [...searchHistoryData];
  }

  async searchEntities(query) {
    // Add delay for realistic loading
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      // In production, this would be:
      // const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      //   headers: {
      //     'Authorization': `Bearer ${API_KEY}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const data = await response.json();

      // Mock implementation
      const results = mockSanctionEntities.filter(entity => 
        entity.name.toLowerCase().includes(query.toLowerCase()) ||
        entity.aliases.some(alias => alias.toLowerCase().includes(query.toLowerCase()))
      );

      // Add to search history
      const historyEntry = {
        Id: Math.max(...this.searchHistory.map(h => h.Id), 0) + 1,
        query: query,
        timestamp: new Date().toISOString(),
        resultCount: results.length
      };
      this.searchHistory.unshift(historyEntry);
      if (this.searchHistory.length > 10) {
        this.searchHistory = this.searchHistory.slice(0, 10);
      }

      return {
        entities: results,
        totalCount: results.length,
        searchTime: 0.3
      };
    } catch (error) {
      throw new Error("Failed to search sanctions database. Please check your connection and try again.");
    }
  }

  async getEntityDetails(entityId) {
    // Add delay for realistic loading
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      // In production, this would be:
      // const response = await fetch(`${API_BASE_URL}/entity/${entityId}`, {
      //   headers: {
      //     'Authorization': `Bearer ${API_KEY}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      // const data = await response.json();

      // Mock implementation
      const entity = mockSanctionEntities.find(e => e.id === entityId);
      if (!entity) {
        throw new Error("Entity not found");
      }

      return entity;
    } catch (error) {
      throw new Error("Failed to fetch entity details. Please try again.");
    }
  }

  getSearchHistory() {
    return [...this.searchHistory];
  }

  clearSearchHistory() {
    this.searchHistory = [];
  }

  async checkApiStatus() {
    // Add delay for realistic loading
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // In production, this would be:
      // const response = await fetch(`${API_BASE_URL}/status`, {
      //   headers: {
      //     'Authorization': `Bearer ${API_KEY}`
      //   }
      // });
      // return response.ok;

      // Mock implementation - always return healthy
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new SanctionsService();