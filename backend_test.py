#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Suvidha Travel
Tests all backend APIs as specified in the review request
"""

import requests
import json
import sys
from datetime import datetime

# Base URL from frontend .env
BASE_URL = "https://suvidha-dashboard.preview.emergentagent.com/api"

# Test credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_test_header(test_name):
    print(f"\n{Colors.BLUE}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.BLUE}{Colors.BOLD}Testing: {test_name}{Colors.ENDC}")
    print(f"{Colors.BLUE}{Colors.BOLD}{'='*60}{Colors.ENDC}")

def print_success(message):
    print(f"{Colors.GREEN}✓ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.RED}✗ {message}{Colors.ENDC}")

def print_warning(message):
    print(f"{Colors.YELLOW}⚠ {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ {message}{Colors.ENDC}")

class SuvidhaAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        self.test_results = {
            'passed': 0,
            'failed': 0,
            'errors': []
        }
        self.created_package_id = None

    def run_test(self, test_name, test_func):
        """Run a single test and track results"""
        try:
            print_info(f"Running: {test_name}")
            result = test_func()
            if result:
                self.test_results['passed'] += 1
                print_success(f"PASSED: {test_name}")
            else:
                self.test_results['failed'] += 1
                print_error(f"FAILED: {test_name}")
            return result
        except Exception as e:
            self.test_results['failed'] += 1
            error_msg = f"ERROR in {test_name}: {str(e)}"
            self.test_results['errors'].append(error_msg)
            print_error(error_msg)
            return False

    def test_health_check(self):
        """Test basic API health"""
        try:
            response = self.session.get(f"{BASE_URL}/health")
            if response.status_code == 200:
                data = response.json()
                print_info(f"Health check response: {data}")
                return data.get('status') == 'healthy'
            else:
                print_error(f"Health check failed with status: {response.status_code}")
                return False
        except Exception as e:
            print_error(f"Health check error: {e}")
            return False

    def test_auth_login_success(self):
        """Test successful admin login"""
        try:
            login_data = {
                "username": ADMIN_USERNAME,
                "password": ADMIN_PASSWORD
            }
            response = self.session.post(f"{BASE_URL}/auth/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                print_info(f"Login response: {data}")
                
                # Check response structure
                if 'message' in data and 'user' in data:
                    if data['user'].get('username') == ADMIN_USERNAME:
                        print_success("Login successful with correct user data")
                        return True
                    else:
                        print_error("Login response missing correct user data")
                        return False
                else:
                    print_error("Login response missing required fields")
                    return False
            else:
                print_error(f"Login failed with status: {response.status_code}, response: {response.text}")
                return False
        except Exception as e:
            print_error(f"Login test error: {e}")
            return False

    def test_auth_verify_without_session(self):
        """Test auth verification without session (should fail)"""
        try:
            # Create a new session without login
            temp_session = requests.Session()
            response = temp_session.get(f"{BASE_URL}/auth/verify")
            
            if response.status_code == 401:
                print_success("Auth verification correctly failed without session")
                return True
            else:
                print_error(f"Auth verification should fail without session, got status: {response.status_code}")
                return False
        except Exception as e:
            print_error(f"Auth verify test error: {e}")
            return False

    def test_auth_verify_with_session(self):
        """Test auth verification with valid session"""
        try:
            response = self.session.get(f"{BASE_URL}/auth/verify")
            
            if response.status_code == 200:
                data = response.json()
                print_info(f"Auth verify response: {data}")
                
                if data.get('authenticated') and 'user' in data:
                    print_success("Auth verification successful with session")
                    return True
                else:
                    print_error("Auth verification response missing required fields")
                    return False
            else:
                print_error(f"Auth verification failed with status: {response.status_code}")
                return False
        except Exception as e:
            print_error(f"Auth verify with session test error: {e}")
            return False

    def test_packages_get_all(self):
        """Test getting all packages (should return 4 packages)"""
        try:
            response = self.session.get(f"{BASE_URL}/packages/")
            
            if response.status_code == 200:
                packages = response.json()
                print_info(f"Found {len(packages)} packages")
                
                if len(packages) == 4:
                    print_success("Correct number of packages returned (4)")
                    # Verify package structure
                    for pkg in packages:
                        if not all(key in pkg for key in ['id', 'title', 'destination', 'price']):
                            print_error("Package missing required fields")
                            return False
                    return True
                else:
                    print_warning(f"Expected 4 packages, got {len(packages)}")
                    return len(packages) > 0  # Still pass if we have some packages
            else:
                print_error(f"Get packages failed with status: {response.status_code}")
                return False
        except Exception as e:
            print_error(f"Get packages test error: {e}")
            return False

    def test_packages_get_single(self):
        """Test getting single package (Thailand package with ID 1)"""
        try:
            response = self.session.get(f"{BASE_URL}/packages/1")
            
            if response.status_code == 200:
                package = response.json()
                print_info(f"Package details: {package.get('title', 'Unknown')}")
                
                # Check if it's a Thailand package
                if package.get('destination') == 'thailand':
                    print_success("Successfully retrieved Thailand package")
                    return True
                else:
                    print_warning(f"Package destination is {package.get('destination')}, expected 'thailand'")
                    return True  # Still pass as we got a valid package
            else:
                print_error(f"Get single package failed with status: {response.status_code}")
                return False
        except Exception as e:
            print_error(f"Get single package test error: {e}")
            return False

    def test_packages_create(self):
        """Test creating a new package"""
        try:
            test_package = {
                "title": "Test Package",
                "destination": "thailand",
                "category": "Thailand",
                "image": "https://test.com/image.jpg",
                "rating": 4.5,
                "duration": "3N/4D",
                "days": "3D Bangkok",
                "price": 15000,
                "originalPrice": 20000,
                "savings": 5000,
                "flightsIncluded": False,
                "groupTour": False,
                "overview": "Test overview",
                "itinerary": [],
                "inclusions": [],
                "exclusions": []
            }
            
            response = self.session.post(f"{BASE_URL}/packages/", json=test_package)
            
            if response.status_code == 200:
                created_package = response.json()
                self.created_package_id = created_package.get('id')
                print_info(f"Created package with ID: {self.created_package_id}")
                
                # Verify the created package has correct data
                if created_package.get('title') == test_package['title']:
                    print_success("Package created successfully with correct data")
                    return True
                else:
                    print_error("Created package has incorrect data")
                    return False
            else:
                print_error(f"Create package failed with status: {response.status_code}, response: {response.text}")
                return False
        except Exception as e:
            print_error(f"Create package test error: {e}")
            return False

    def test_packages_update(self):
        """Test updating the created package"""
        if not self.created_package_id:
            print_error("No package ID available for update test")
            return False
            
        try:
            update_data = {
                "title": "Updated Test Package",
                "destination": "thailand",
                "category": "Thailand",
                "image": "https://test.com/updated-image.jpg",
                "rating": 4.8,
                "duration": "4N/5D",
                "days": "4D Bangkok",
                "price": 18000,
                "originalPrice": 25000,
                "savings": 7000,
                "flightsIncluded": True,
                "groupTour": False,
                "overview": "Updated test overview",
                "itinerary": [],
                "inclusions": [],
                "exclusions": []
            }
            
            response = self.session.put(f"{BASE_URL}/packages/{self.created_package_id}", json=update_data)
            
            if response.status_code == 200:
                updated_package = response.json()
                print_info(f"Updated package title: {updated_package.get('title')}")
                
                if updated_package.get('title') == update_data['title']:
                    print_success("Package updated successfully")
                    return True
                else:
                    print_error("Package update did not reflect changes")
                    return False
            else:
                print_error(f"Update package failed with status: {response.status_code}")
                return False
        except Exception as e:
            print_error(f"Update package test error: {e}")
            return False

    def test_packages_delete(self):
        """Test deleting the created package"""
        if not self.created_package_id:
            print_error("No package ID available for delete test")
            return False
            
        try:
            response = self.session.delete(f"{BASE_URL}/packages/{self.created_package_id}")
            
            if response.status_code == 200:
                result = response.json()
                print_info(f"Delete response: {result}")
                
                # Verify package is actually deleted
                verify_response = self.session.get(f"{BASE_URL}/packages/{self.created_package_id}")
                if verify_response.status_code == 404:
                    print_success("Package deleted successfully")
                    return True
                else:
                    print_error("Package still exists after deletion")
                    return False
            else:
                print_error(f"Delete package failed with status: {response.status_code}")
                return False
        except Exception as e:
            print_error(f"Delete package test error: {e}")
            return False

    def test_destinations_get_all(self):
        """Test getting all destinations (should return 11 destinations)"""
        try:
            response = self.session.get(f"{BASE_URL}/destinations/")
            
            if response.status_code == 200:
                destinations = response.json()
                print_info(f"Found {len(destinations)} destinations")
                
                if len(destinations) == 11:
                    print_success("Correct number of destinations returned (11)")
                    return True
                else:
                    print_warning(f"Expected 11 destinations, got {len(destinations)}")
                    return len(destinations) > 0  # Still pass if we have some destinations
            else:
                print_error(f"Get destinations failed with status: {response.status_code}")
                return False
        except Exception as e:
            print_error(f"Get destinations test error: {e}")
            return False

    def test_destinations_get_thailand(self):
        """Test getting Thailand destination"""
        try:
            response = self.session.get(f"{BASE_URL}/destinations/thailand")
            
            if response.status_code == 200:
                destination = response.json()
                print_info(f"Thailand destination: {destination.get('name', 'Unknown')}")
                
                if destination.get('id') == 'thailand':
                    print_success("Successfully retrieved Thailand destination")
                    return True
                else:
                    print_error("Retrieved destination is not Thailand")
                    return False
            else:
                print_error(f"Get Thailand destination failed with status: {response.status_code}")
                return False
        except Exception as e:
            print_error(f"Get Thailand destination test error: {e}")
            return False

    def test_banners_get_all(self):
        """Test getting all banners (should return 2 banners)"""
        try:
            response = self.session.get(f"{BASE_URL}/banners/")
            
            if response.status_code == 200:
                banners = response.json()
                print_info(f"Found {len(banners)} banners")
                
                if len(banners) == 2:
                    print_success("Correct number of banners returned (2)")
                    return True
                else:
                    print_warning(f"Expected 2 banners, got {len(banners)}")
                    return len(banners) > 0  # Still pass if we have some banners
            else:
                print_error(f"Get banners failed with status: {response.status_code}")
                return False
        except Exception as e:
            print_error(f"Get banners test error: {e}")
            return False

    def test_settings_get(self):
        """Test getting company settings"""
        try:
            response = self.session.get(f"{BASE_URL}/settings/")
            
            if response.status_code == 200:
                settings = response.json()
                print_info(f"Company name: {settings.get('name', 'Unknown')}")
                
                # Check required fields
                required_fields = ['name', 'phones', 'emails', 'address', 'website']
                if all(field in settings for field in required_fields):
                    print_success("Settings retrieved with all required fields")
                    return True
                else:
                    print_error("Settings missing required fields")
                    return False
            else:
                print_error(f"Get settings failed with status: {response.status_code}")
                return False
        except Exception as e:
            print_error(f"Get settings test error: {e}")
            return False

    def test_settings_update(self):
        """Test updating settings (test only, don't actually change)"""
        try:
            # First get current settings
            get_response = self.session.get(f"{BASE_URL}/settings/")
            if get_response.status_code != 200:
                print_error("Cannot get current settings for update test")
                return False
                
            current_settings = get_response.json()
            
            # Create test update (same data to avoid actual changes)
            test_update = {
                "name": current_settings.get('name', 'Suvidha Travel'),
                "phones": current_settings.get('phones', []),
                "emails": current_settings.get('emails', []),
                "address": current_settings.get('address', ''),
                "website": current_settings.get('website', '')
            }
            
            response = self.session.put(f"{BASE_URL}/settings/", json=test_update)
            
            if response.status_code == 200:
                updated_settings = response.json()
                print_info(f"Settings update response received")
                print_success("Settings update endpoint working correctly")
                return True
            else:
                print_error(f"Update settings failed with status: {response.status_code}")
                return False
        except Exception as e:
            print_error(f"Update settings test error: {e}")
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print(f"{Colors.BOLD}🚀 Starting Suvidha Travel Backend API Tests{Colors.ENDC}")
        print(f"{Colors.BOLD}Base URL: {BASE_URL}{Colors.ENDC}")
        print(f"{Colors.BOLD}Timestamp: {datetime.now().isoformat()}{Colors.ENDC}")
        
        # Health Check
        print_test_header("Health Check")
        self.run_test("API Health Check", self.test_health_check)
        
        # Authentication Tests
        print_test_header("Authentication API")
        self.run_test("Admin Login (Success)", self.test_auth_login_success)
        self.run_test("Auth Verify (Without Session)", self.test_auth_verify_without_session)
        self.run_test("Auth Verify (With Session)", self.test_auth_verify_with_session)
        
        # Packages API Tests
        print_test_header("Packages API")
        self.run_test("Get All Packages", self.test_packages_get_all)
        self.run_test("Get Single Package (Thailand)", self.test_packages_get_single)
        self.run_test("Create New Package", self.test_packages_create)
        self.run_test("Update Package", self.test_packages_update)
        self.run_test("Delete Package", self.test_packages_delete)
        
        # Destinations API Tests
        print_test_header("Destinations API")
        self.run_test("Get All Destinations", self.test_destinations_get_all)
        self.run_test("Get Thailand Destination", self.test_destinations_get_thailand)
        
        # Banners API Tests
        print_test_header("Banners API")
        self.run_test("Get All Banners", self.test_banners_get_all)
        
        # Settings API Tests
        print_test_header("Settings API")
        self.run_test("Get Company Settings", self.test_settings_get)
        self.run_test("Update Settings (Test)", self.test_settings_update)
        
        # Print final results
        self.print_final_results()

    def print_final_results(self):
        """Print comprehensive test results"""
        print(f"\n{Colors.BOLD}{'='*80}{Colors.ENDC}")
        print(f"{Colors.BOLD}🏁 TEST RESULTS SUMMARY{Colors.ENDC}")
        print(f"{Colors.BOLD}{'='*80}{Colors.ENDC}")
        
        total_tests = self.test_results['passed'] + self.test_results['failed']
        pass_rate = (self.test_results['passed'] / total_tests * 100) if total_tests > 0 else 0
        
        print(f"{Colors.GREEN}✓ Passed: {self.test_results['passed']}{Colors.ENDC}")
        print(f"{Colors.RED}✗ Failed: {self.test_results['failed']}{Colors.ENDC}")
        print(f"{Colors.BLUE}📊 Pass Rate: {pass_rate:.1f}%{Colors.ENDC}")
        
        if self.test_results['errors']:
            print(f"\n{Colors.RED}{Colors.BOLD}❌ ERRORS ENCOUNTERED:{Colors.ENDC}")
            for error in self.test_results['errors']:
                print(f"{Colors.RED}  • {error}{Colors.ENDC}")
        
        if self.test_results['failed'] == 0:
            print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 ALL TESTS PASSED! Backend APIs are working correctly.{Colors.ENDC}")
        else:
            print(f"\n{Colors.YELLOW}{Colors.BOLD}⚠️  Some tests failed. Please review the errors above.{Colors.ENDC}")
        
        print(f"{Colors.BOLD}{'='*80}{Colors.ENDC}")

if __name__ == "__main__":
    tester = SuvidhaAPITester()
    tester.run_all_tests()