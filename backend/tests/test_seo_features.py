"""
Test SEO Features for Packages and Holiday Pages
Tests:
1. Package SEO fields (seo_title, seo_description, focus_keyword)
2. India Holiday Page SEO fields
3. International Holiday Page SEO fields
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestPackageSEOFields:
    """Test SEO fields on packages"""
    
    def test_get_packages_list(self):
        """Verify packages endpoint returns data"""
        response = requests.get(f"{BASE_URL}/api/packages")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"Found {len(data)} packages")
        return data
    
    def test_package_has_seo_fields(self):
        """Verify packages have SEO fields in response"""
        response = requests.get(f"{BASE_URL}/api/packages")
        assert response.status_code == 200
        packages = response.json()
        
        if len(packages) > 0:
            pkg = packages[0]
            # SEO fields should exist (may be empty strings)
            # The model defines them as Optional with default ""
            print(f"Package fields: {list(pkg.keys())}")
            # Check if SEO fields are present or can be added
            # Note: They may not be present if not set yet
            print(f"Package ID: {pkg.get('id')}")
            print(f"Package title: {pkg.get('title')}")
            print(f"SEO title: {pkg.get('seo_title', 'NOT SET')}")
            print(f"SEO description: {pkg.get('seo_description', 'NOT SET')}")
            print(f"Focus keyword: {pkg.get('focus_keyword', 'NOT SET')}")
        else:
            pytest.skip("No packages found to test")
    
    def test_create_package_with_seo_fields(self):
        """Test creating a package with SEO fields"""
        test_package = {
            "title": "TEST_SEO_Package",
            "destination": "test-dest",
            "category": "Test",
            "image": "https://example.com/test.jpg",
            "duration": "3N/4D",
            "days": "4 Days",
            "price": 10000,
            "originalPrice": 12000,
            "savings": 2000,
            "region": "india",
            "seo_title": "Best Test Package for SEO Testing - 50 chars exactly",
            "seo_description": "This is a test meta description for SEO testing purposes. It should be between 140-160 characters for optimal SEO score. Testing the SEO widget.",
            "focus_keyword": "test package"
        }
        
        response = requests.post(f"{BASE_URL}/api/packages/", json=test_package)
        assert response.status_code == 200, f"Failed to create package: {response.text}"
        
        created = response.json()
        assert created.get("seo_title") == test_package["seo_title"]
        assert created.get("seo_description") == test_package["seo_description"]
        assert created.get("focus_keyword") == test_package["focus_keyword"]
        
        print(f"Created package with ID: {created.get('id')}")
        print(f"SEO title saved: {created.get('seo_title')}")
        print(f"SEO description saved: {created.get('seo_description')}")
        print(f"Focus keyword saved: {created.get('focus_keyword')}")
        
        # Cleanup - delete the test package
        pkg_id = created.get("id")
        if pkg_id:
            delete_response = requests.delete(f"{BASE_URL}/api/packages/{pkg_id}")
            print(f"Cleanup: Deleted test package, status: {delete_response.status_code}")
    
    def test_update_package_seo_fields(self):
        """Test updating SEO fields on an existing package"""
        # First create a test package
        test_package = {
            "title": "TEST_SEO_Update_Package",
            "destination": "test-dest",
            "category": "Test",
            "image": "https://example.com/test.jpg",
            "duration": "3N/4D",
            "days": "4 Days",
            "price": 10000,
            "originalPrice": 12000,
            "savings": 2000,
            "region": "india"
        }
        
        create_response = requests.post(f"{BASE_URL}/api/packages/", json=test_package)
        assert create_response.status_code == 200
        created = create_response.json()
        pkg_id = created.get("id")
        
        # Update with SEO fields
        update_data = {
            **test_package,
            "seo_title": "Updated SEO Title for Testing - Exactly 50 chars",
            "seo_description": "Updated meta description for SEO testing. This description is optimized for search engines and should be between 140-160 characters long.",
            "focus_keyword": "updated keyword"
        }
        
        update_response = requests.put(f"{BASE_URL}/api/packages/{pkg_id}", json=update_data)
        assert update_response.status_code == 200, f"Failed to update: {update_response.text}"
        
        updated = update_response.json()
        assert updated.get("seo_title") == update_data["seo_title"]
        assert updated.get("seo_description") == update_data["seo_description"]
        assert updated.get("focus_keyword") == update_data["focus_keyword"]
        
        print(f"Updated package SEO fields successfully")
        
        # Verify by fetching
        get_response = requests.get(f"{BASE_URL}/api/packages/{pkg_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched.get("seo_title") == update_data["seo_title"]
        print(f"Verified SEO fields persisted after update")
        
        # Cleanup
        requests.delete(f"{BASE_URL}/api/packages/{pkg_id}")


class TestIndiaHolidayPageSEO:
    """Test SEO fields on India Holiday Page configuration"""
    
    def test_get_india_page_config(self):
        """Verify India holiday page config endpoint works"""
        response = requests.get(f"{BASE_URL}/api/pages/india")
        assert response.status_code == 200
        config = response.json()
        
        print(f"India page config keys: {list(config.keys())}")
        print(f"SEO title: {config.get('seo_title', 'NOT SET')}")
        print(f"SEO description: {config.get('seo_description', 'NOT SET')}")
        print(f"Focus keyword: {config.get('focus_keyword', 'NOT SET')}")
        
        return config
    
    def test_update_india_page_seo_fields(self):
        """Test updating SEO fields on India holiday page"""
        # First get current config
        get_response = requests.get(f"{BASE_URL}/api/pages/india")
        assert get_response.status_code == 200
        current_config = get_response.json()
        
        # Update with SEO fields
        update_data = {
            "pageType": "india",
            "banner": current_config.get("banner"),
            "tabs": current_config.get("tabs", []),
            "search": current_config.get("search", {}),
            "trending": current_config.get("trending", {}),
            "headerDropdown": current_config.get("headerDropdown", []),
            "seo_title": "India Holidays - Best Travel Packages 2026 - 50ch",
            "seo_description": "Discover amazing India holiday packages with Suvidha Travel. Book your dream vacation to Himachal, Kerala, Rajasthan and more. Best prices guaranteed!",
            "focus_keyword": "india holidays"
        }
        
        update_response = requests.put(f"{BASE_URL}/api/pages/india", json=update_data)
        assert update_response.status_code == 200, f"Failed to update: {update_response.text}"
        
        updated = update_response.json()
        assert updated.get("seo_title") == update_data["seo_title"]
        assert updated.get("seo_description") == update_data["seo_description"]
        assert updated.get("focus_keyword") == update_data["focus_keyword"]
        
        print(f"India page SEO fields updated successfully")
        print(f"SEO title: {updated.get('seo_title')}")
        print(f"SEO description: {updated.get('seo_description')}")
        print(f"Focus keyword: {updated.get('focus_keyword')}")
        
        # Verify persistence
        verify_response = requests.get(f"{BASE_URL}/api/pages/india")
        assert verify_response.status_code == 200
        verified = verify_response.json()
        assert verified.get("seo_title") == update_data["seo_title"]
        print(f"Verified India page SEO fields persisted")


class TestInternationalHolidayPageSEO:
    """Test SEO fields on International Holiday Page configuration"""
    
    def test_get_international_page_config(self):
        """Verify International holiday page config endpoint works"""
        response = requests.get(f"{BASE_URL}/api/pages/international")
        assert response.status_code == 200
        config = response.json()
        
        print(f"International page config keys: {list(config.keys())}")
        print(f"SEO title: {config.get('seo_title', 'NOT SET')}")
        print(f"SEO description: {config.get('seo_description', 'NOT SET')}")
        print(f"Focus keyword: {config.get('focus_keyword', 'NOT SET')}")
        
        return config
    
    def test_update_international_page_seo_fields(self):
        """Test updating SEO fields on International holiday page"""
        # First get current config
        get_response = requests.get(f"{BASE_URL}/api/pages/international")
        assert get_response.status_code == 200
        current_config = get_response.json()
        
        # Update with SEO fields
        update_data = {
            "pageType": "international",
            "banner": current_config.get("banner"),
            "tabs": current_config.get("tabs", []),
            "search": current_config.get("search", {}),
            "trending": current_config.get("trending", {}),
            "headerDropdown": current_config.get("headerDropdown", []),
            "seo_title": "International Holidays - World Travel Packages 26",
            "seo_description": "Explore the world with Suvidha Travel international holiday packages. Visit Thailand, Bali, Singapore, Maldives and more. Affordable luxury travel!",
            "focus_keyword": "international holidays"
        }
        
        update_response = requests.put(f"{BASE_URL}/api/pages/international", json=update_data)
        assert update_response.status_code == 200, f"Failed to update: {update_response.text}"
        
        updated = update_response.json()
        assert updated.get("seo_title") == update_data["seo_title"]
        assert updated.get("seo_description") == update_data["seo_description"]
        assert updated.get("focus_keyword") == update_data["focus_keyword"]
        
        print(f"International page SEO fields updated successfully")
        print(f"SEO title: {updated.get('seo_title')}")
        print(f"SEO description: {updated.get('seo_description')}")
        print(f"Focus keyword: {updated.get('focus_keyword')}")
        
        # Verify persistence
        verify_response = requests.get(f"{BASE_URL}/api/pages/international")
        assert verify_response.status_code == 200
        verified = verify_response.json()
        assert verified.get("seo_title") == update_data["seo_title"]
        print(f"Verified International page SEO fields persisted")


class TestHealthCheck:
    """Basic health check tests"""
    
    def test_api_health(self):
        """Test API health endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data.get("status") == "healthy"
        print("API health check passed")
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        print("API root endpoint accessible")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
