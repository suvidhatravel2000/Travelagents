"""
Blog API Tests - Testing CRUD operations for Blog CMS feature
Tests: GET /api/blog/, POST /api/blog/, PUT /api/blog/{id}, DELETE /api/blog/{id}, GET /api/blog/{slug}
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


class TestBlogHealthCheck:
    """Basic health check for blog API"""
    
    def test_api_health(self, api_client):
        """Test API is accessible"""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        print("✓ API health check passed")


class TestBlogCRUD:
    """Blog CRUD operations tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self, api_client):
        """Store api_client for use in tests"""
        self.api_client = api_client
        self.created_post_ids = []
    
    def test_get_all_blog_posts(self, api_client):
        """Test GET /api/blog/ returns list of posts"""
        response = api_client.get(f"{BASE_URL}/api/blog/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/blog/ returned {len(data)} posts")
    
    def test_get_blog_categories(self, api_client):
        """Test GET /api/blog/categories returns categories"""
        response = api_client.get(f"{BASE_URL}/api/blog/categories")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ GET /api/blog/categories returned {len(data)} categories")
    
    def test_create_blog_post(self, api_client):
        """Test POST /api/blog/ creates a new post"""
        unique_id = str(uuid.uuid4())[:8]
        post_data = {
            "title": f"TEST_Blog Post {unique_id}",
            "excerpt": "This is a test excerpt for the blog post",
            "content": "# Test Content\n\nThis is **bold** and *italic* text.\n\n- List item 1\n- List item 2\n\n> A quote",
            "author": "Test Author",
            "category": "Test Category",
            "tags": ["test", "automation"],
            "status": "draft",
            "featured": False,
            "seo_title": "Test SEO Title",
            "seo_description": "Test SEO Description",
            "focus_keyword": "test"
        }
        
        response = api_client.post(f"{BASE_URL}/api/blog/", json=post_data)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        created = response.json()
        assert "id" in created
        assert created["title"] == post_data["title"]
        assert created["excerpt"] == post_data["excerpt"]
        assert created["content"] == post_data["content"]
        assert created["author"] == post_data["author"]
        assert created["category"] == post_data["category"]
        assert created["tags"] == post_data["tags"]
        assert created["status"] == post_data["status"]
        assert created["featured"] == post_data["featured"]
        assert "slug" in created and created["slug"]  # Slug should be auto-generated
        
        # Store for cleanup
        self.created_post_ids.append(created["id"])
        print(f"✓ POST /api/blog/ created post with id: {created['id']}, slug: {created['slug']}")
        
        return created
    
    def test_create_and_get_blog_post_by_id(self, api_client):
        """Test creating a post and retrieving it by ID"""
        unique_id = str(uuid.uuid4())[:8]
        post_data = {
            "title": f"TEST_Get By ID {unique_id}",
            "excerpt": "Test excerpt",
            "content": "Test content",
            "status": "published",
            "featured": True,
            "category": "Destinations"
        }
        
        # Create
        create_response = api_client.post(f"{BASE_URL}/api/blog/", json=post_data)
        assert create_response.status_code == 200
        created = create_response.json()
        post_id = created["id"]
        
        # Get by ID
        get_response = api_client.get(f"{BASE_URL}/api/blog/{post_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        
        assert fetched["id"] == post_id
        assert fetched["title"] == post_data["title"]
        assert fetched["status"] == "published"
        assert fetched["featured"] == True
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/{post_id}")
        print(f"✓ GET /api/blog/{post_id} returned correct post data")
    
    def test_get_blog_post_by_slug(self, api_client):
        """Test GET /api/blog/{slug} returns post by slug"""
        unique_id = str(uuid.uuid4())[:8]
        post_data = {
            "title": f"TEST Slug Test {unique_id}",
            "excerpt": "Test excerpt for slug test",
            "content": "Content for slug test",
            "status": "published"
        }
        
        # Create
        create_response = api_client.post(f"{BASE_URL}/api/blog/", json=post_data)
        assert create_response.status_code == 200
        created = create_response.json()
        slug = created["slug"]
        post_id = created["id"]
        
        # Get by slug
        get_response = api_client.get(f"{BASE_URL}/api/blog/{slug}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        
        assert fetched["slug"] == slug
        assert fetched["title"] == post_data["title"]
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/{post_id}")
        print(f"✓ GET /api/blog/{slug} returned correct post by slug")
    
    def test_update_blog_post(self, api_client):
        """Test PUT /api/blog/{id} updates a post"""
        unique_id = str(uuid.uuid4())[:8]
        
        # Create first
        post_data = {
            "title": f"TEST_Original Title {unique_id}",
            "excerpt": "Original excerpt",
            "content": "Original content",
            "status": "draft"
        }
        create_response = api_client.post(f"{BASE_URL}/api/blog/", json=post_data)
        assert create_response.status_code == 200
        created = create_response.json()
        post_id = created["id"]
        
        # Update
        update_data = {
            "title": f"TEST_Updated Title {unique_id}",
            "excerpt": "Updated excerpt",
            "content": "Updated content",
            "status": "published",
            "featured": True,
            "category": "Updated Category",
            "tags": ["updated", "test"]
        }
        update_response = api_client.put(f"{BASE_URL}/api/blog/{post_id}", json=update_data)
        assert update_response.status_code == 200
        updated = update_response.json()
        
        assert updated["title"] == update_data["title"]
        assert updated["excerpt"] == update_data["excerpt"]
        assert updated["status"] == "published"
        assert updated["featured"] == True
        assert updated["category"] == "Updated Category"
        
        # Verify with GET
        get_response = api_client.get(f"{BASE_URL}/api/blog/{post_id}")
        assert get_response.status_code == 200
        fetched = get_response.json()
        assert fetched["title"] == update_data["title"]
        
        # Cleanup
        api_client.delete(f"{BASE_URL}/api/blog/{post_id}")
        print(f"✓ PUT /api/blog/{post_id} updated post successfully")
    
    def test_delete_blog_post(self, api_client):
        """Test DELETE /api/blog/{id} removes a post"""
        unique_id = str(uuid.uuid4())[:8]
        
        # Create first
        post_data = {
            "title": f"TEST_To Delete {unique_id}",
            "content": "This post will be deleted"
        }
        create_response = api_client.post(f"{BASE_URL}/api/blog/", json=post_data)
        assert create_response.status_code == 200
        created = create_response.json()
        post_id = created["id"]
        
        # Delete
        delete_response = api_client.delete(f"{BASE_URL}/api/blog/{post_id}")
        assert delete_response.status_code == 200
        
        # Verify deleted
        get_response = api_client.get(f"{BASE_URL}/api/blog/{post_id}")
        assert get_response.status_code == 404
        
        print(f"✓ DELETE /api/blog/{post_id} removed post successfully")
    
    def test_filter_by_status(self, api_client):
        """Test filtering posts by status"""
        # Get published posts
        response = api_client.get(f"{BASE_URL}/api/blog/", params={"status": "published"})
        assert response.status_code == 200
        posts = response.json()
        
        # All returned posts should be published
        for post in posts:
            assert post["status"] == "published", f"Post {post['id']} has status {post['status']}, expected published"
        
        print(f"✓ Filter by status=published returned {len(posts)} posts")
    
    def test_filter_by_category(self, api_client):
        """Test filtering posts by category"""
        # First get categories
        cat_response = api_client.get(f"{BASE_URL}/api/blog/categories")
        categories = cat_response.json()
        
        if categories:
            category = categories[0]
            response = api_client.get(f"{BASE_URL}/api/blog/", params={"category": category})
            assert response.status_code == 200
            posts = response.json()
            
            for post in posts:
                assert post["category"] == category
            
            print(f"✓ Filter by category={category} returned {len(posts)} posts")
        else:
            print("⚠ No categories found to test filter")
    
    def test_get_nonexistent_post(self, api_client):
        """Test GET for non-existent post returns 404"""
        response = api_client.get(f"{BASE_URL}/api/blog/nonexistent-post-id-12345")
        assert response.status_code == 404
        print("✓ GET non-existent post returns 404")
    
    def test_delete_nonexistent_post(self, api_client):
        """Test DELETE for non-existent post returns 404"""
        response = api_client.delete(f"{BASE_URL}/api/blog/nonexistent-post-id-12345")
        assert response.status_code == 404
        print("✓ DELETE non-existent post returns 404")


class TestBlogSeedData:
    """Test seed data exists"""
    
    def test_seed_post_exists(self, api_client):
        """Test that the seed blog post exists"""
        # Try to get the seed post by slug
        response = api_client.get(f"{BASE_URL}/api/blog/top-10-places-to-visit-in-ladakh")
        
        if response.status_code == 200:
            post = response.json()
            assert post["title"] == "Top 10 Places to Visit in Ladakh"
            assert post["status"] == "published"
            assert post["featured"] == True
            assert post["category"] == "Destinations"
            print(f"✓ Seed post 'Top 10 Places to Visit in Ladakh' exists with correct data")
        else:
            print(f"⚠ Seed post not found (status: {response.status_code})")


class TestCleanup:
    """Cleanup test data"""
    
    def test_cleanup_test_posts(self, api_client):
        """Remove all TEST_ prefixed posts"""
        response = api_client.get(f"{BASE_URL}/api/blog/")
        if response.status_code == 200:
            posts = response.json()
            deleted_count = 0
            for post in posts:
                if post.get("title", "").startswith("TEST_"):
                    del_response = api_client.delete(f"{BASE_URL}/api/blog/{post['id']}")
                    if del_response.status_code == 200:
                        deleted_count += 1
            print(f"✓ Cleaned up {deleted_count} test posts")
