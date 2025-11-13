// Configuration
        const SERVER_URL = 'http://localhost:3000';

        // Load departments and categories on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadDepartments();
            loadCategories();
            loadUserComplaints();

            const reportForm = document.getElementById('report-issue-form');
            if (reportForm) {
                reportForm.addEventListener('submit', submitComplaint);
            }
        });

        // Load departments
        async function loadDepartments() {
            try {
                const response = await fetch(`${SERVER_URL}/api/departments`);
                const data = await response.json();

                const departmentSelect = document.getElementById('issue-department');
                departmentSelect.innerHTML = '<option value="">Select Department</option>';

                data.departments.forEach(dept => {
                    const option = document.createElement('option');
                    option.value = dept.Name; // Use Name instead of ID
                    option.textContent = dept.Name;
                    departmentSelect.appendChild(option);
                });
                console.log('✅ Departments loaded:', data.departments.length);
            } catch (error) {
                console.error('❌ Error loading departments:', error);
            }
        }

        // Load categories
        async function loadCategories() {
            try {
                const response = await fetch(`${SERVER_URL}/api/categories`);

                const data = await response.json();

                const categorySelect = document.getElementById('issue-category');
                categorySelect.innerHTML = '<option value="">Select Category</option>';

                data.categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.Name; // Use Name instead of ID
                    option.textContent = cat.Name;
                    categorySelect.appendChild(option);
                });
                console.log('✅ Categories loaded:', data.categories.length);
            } catch (error) {
                console.error('❌ Error loading categories:', error);
            }
        }

        // Load user complaints
        async function loadUserComplaints() {
            try {
                const response = await fetch(`${SERVER_URL}/complaints/my-complaints`, {
                    credentials: 'include'
                });
                const data = await response.json();

                if (response.ok) {
                    displayComplaints(data.complaints);
                }
            } catch (error) {
                console.error('❌ Error loading complaints:', error);
            }
        }

        // Display complaints in the UI
        function displayComplaints(complaints) {
            const requestsCard = document.querySelector('.requests-card .card-content');
            if (!requestsCard) return;

            requestsCard.innerHTML = '';

            if (complaints.length === 0) {
                requestsCard.innerHTML = '<p style="color: #64748b;">No complaints yet</p>';
                return;
            }

            complaints.slice(0, 3).forEach(complaint => {
                const requestItem = document.createElement('div');
                requestItem.className = 'request-item';

                const statusClass = complaint.status === 'resolved' ? 'ready' :
                                    complaint.status === 'in-progress' ? 'in-progress' : 'pending';

                requestItem.innerHTML = `
                    <div class="request-info">
                        <span>${complaint.category_name || 'Complaint'}</span>
                        <small>Submitted ${new Date(complaint.created_at).toLocaleDateString()}</small>
                    </div>
                    <span class="status ${statusClass}">${complaint.status}</span>
                `;

                requestsCard.appendChild(requestItem);
            });
        }

        // Dashboard functions
        function showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'notification';

            // Set colors based on type
            let bgColor = 'linear-gradient(135deg, #3b82f6, #60a5fa)';
            if (type === 'success') bgColor = 'linear-gradient(135deg, #10b981, #34d399)';
            if (type === 'error') bgColor = 'linear-gradient(135deg, #ef4444, #f87171)';
            if (type === 'warning') bgColor = 'linear-gradient(135deg, #f59e0b, #fbbf24)';

            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: ${bgColor};
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                font-weight: 500;
                max-width: 350px;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = message;

            document.body.appendChild(notification);

            // Remove after 4 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 4000);
        }

        function toggleNotifications() {
            // This assumes you have a notifications panel with ID 'notificationsPanel'
            // I'll add a simple alert for now as the panel HTML is missing.
            alert('Notifications panel will open here');
        }

        function toggleProfileMenu() {
            const menu = document.getElementById('profileMenu');
            if (menu) {
                // Using classList.toggle is more robust for animated menus
                menu.classList.toggle('active'); 
                // Assumes your CSS file has .profile-menu-dropdown.active { ... }
                // For this code, I'll revert to your original style logic
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            }
        }

        // --- Modal Functions ---
        
        function openReportIssue() {
            const modal = document.getElementById('report-issue-modal');
            const overlay = document.getElementById('modalOverlay');
            if (modal && overlay) {
                overlay.style.display = 'block';
                modal.style.display = 'block';
                setTimeout(() => {
                    overlay.style.opacity = '1';
                    modal.style.opacity = '1';
                    modal.style.transform = 'translate(-50%, -50%)';
                }, 10); 
            }
        }

        function closeReportModal() {
            const modal = document.getElementById('report-issue-modal');
            const overlay = document.getElementById('modalOverlay');
            if (modal && overlay) {
                overlay.style.opacity = '0';
                modal.style.opacity = '0';
                modal.style.transform = 'translate(-50%, -40%)';
                setTimeout(() => {
                    overlay.style.display = 'none';
                    modal.style.display = 'none';
                }, 300);
            }
        }

        // ADDED: Functions for the new Settings Modal
        function openSettingsModal() {
            const modal = document.getElementById('settings-modal');
            const overlay = document.getElementById('modalOverlay');
            if (modal && overlay) {
                overlay.style.display = 'block';
                modal.style.display = 'block';
                setTimeout(() => {
                    overlay.style.opacity = '1';
                    modal.style.opacity = '1';
                    modal.style.transform = 'translate(-50%, -50%)'; // Use same animation
                }, 10);
            }
        }

        function closeSettingsModal() {
            const modal = document.getElementById('settings-modal');
            const overlay = document.getElementById('modalOverlay');
            if (modal && overlay) {
                overlay.style.opacity = '0';
                modal.style.opacity = '0';
                modal.style.transform = 'translate(-50%, -40%)'; // Use same animation
                setTimeout(() => {
                    overlay.style.display = 'none';
                    modal.style.display = 'none';
                }, 300);
            }
        }

        // UPDATED: closeModal now closes all modals
        function closeModal() {
            closeReportModal();
            closeSettingsModal(); // Also close settings modal
        }

        async function submitComplaint(event) {
            console.log("submitComplaint called");
            event.preventDefault();

            const complaintData = {
                category: document.getElementById('issue-category').value,
                department: document.getElementById('issue-department').value,
                description: document.getElementById('issue-description').value,
                imageUrl: document.getElementById('issue-image').value || null,
                Pincode: document.getElementById('issue-pincode').value,
                State: document.getElementById('issue-state').value,
                City: document.getElementById('issue-city').value,
                Address_Line: document.getElementById('issue-address').value || null
            };

            console.log("📤 Sending complaint data:", complaintData);

            try {
                const response = await fetch(`${SERVER_URL}/user/registerComplain`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(complaintData)
                });

                const data = await response.json();
                console.log("📥 Server response:", data);
                console.log("Response status:", response.status);

                if (response.ok) {
                    console.log("✅ Complaint submitted successfully!");
                    document.getElementById('report-issue-form').reset();
                    closeReportModal();
                    showNotification('Complaint submitted successfully!', 'success');
                    loadUserComplaints(); // Reload complaints
                } else {
                    console.error("❌ Server error:", data);
                    showNotification(data.error || data.message || 'Error submitting complaint', 'error');
                }
            } catch (error) {
                console.error('❌ Error submitting complaint:', error);
                showNotification('Error submitting complaint. Please try again.', 'error');
            }
        }

        // --- Other Action/Helper Functions ---

        function openTrackComplaint() {
            alert('Track complaint interface will open here');
        }

        function openPayBill() {
            alert('Pay bill interface will open here');
        }

        function openRequestCertificate() {
            alert('Request certificate interface will open here');
        }

        function openBookAppointment() {
            alert('Book appointment interface will open here');
        }

        // REMOVED: openService(serviceName) function is gone.

        // These are the accessibility functions, they will work fine here
        function toggleHighContrast() {
            document.body.classList.toggle('high-contrast');
            // You'll need to define .high-contrast in your CSS file
        }

        function increaseTextSize() {
            const currentSize = parseFloat(getComputedStyle(document.body).fontSize);
            document.body.style.fontSize = (currentSize + 2) + 'px';
        }

        function toggleScreenReader() {
            alert('Screen reader mode toggled (simulation)');
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                window.location.href = '../front.html';
            }
        }

        // Close profile menu when clicking outside
        document.addEventListener('click', function(event) {
            const profileMenu = document.querySelector('.profile-menu');
            const profileMenuDropdown = document.getElementById('profileMenu');

            // This logic ensures that clicking *on* the profile menu button doesn't
            // immediately close the dropdown.
            if (profileMenuDropdown && !profileMenu.contains(event.target) && !profileMenuDropdown.contains(event.target)) {
                profileMenuDropdown.style.display = 'none';
            }
        });