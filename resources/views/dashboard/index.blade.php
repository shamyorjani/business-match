@extends('layouts.app')

@section('content')
<div class="min-h-screen bg-gray-100">
    <!-- Login Modal -->
    <div id="loginModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 hidden overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div class="mt-3 text-center">
                <h3 class="text-lg leading-6 font-medium text-gray-900">Please Login</h3>
                <div class="mt-2 px-7 py-3">
                    <form id="loginForm" class="space-y-4">
                        @csrf
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="email" name="email" required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#40033f] focus:ring-[#40033f] sm:text-sm">
                        </div>
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" id="password" name="password" required
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#40033f] focus:ring-[#40033f] sm:text-sm">
                        </div>
                        <div>
                            <button type="submit"
                                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#40033f] to-[#9c0c40] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40033f]">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Navigation -->
    <nav class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <h1 class="text-xl font-bold text-[#40033f]">Dashboard</h1>
                    </div>
                </div>
                <div class="flex items-center">
                    <button onclick="window.location.href='/'" class="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#40033f] to-[#9c0c40] rounded-md hover:opacity-90">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <!-- Profile Card -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="h-12 w-12 rounded-full bg-gradient-to-r from-[#40033f] to-[#9c0c40] flex items-center justify-center">
                                    <span class="text-white text-xl font-bold" id="userInitials"></span>
                                </div>
                            </div>
                            <div class="ml-5">
                                <h3 class="text-lg font-medium text-gray-900" id="userName"></h3>
                                <p class="text-sm text-gray-500" id="userEmail"></p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <h3 class="text-lg font-medium text-gray-900">Quick Stats</h3>
                        <div class="mt-4 space-y-4">
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-500">Total Meetings</span>
                                <span class="text-sm font-medium text-gray-900" id="totalMeetings">0</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-500">Pending</span>
                                <span class="text-sm font-medium text-yellow-600" id="pendingMeetings">0</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-sm text-gray-500">Approved</span>
                                <span class="text-sm font-medium text-green-600" id="approvedMeetings">0</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="p-5">
                        <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
                        <div class="mt-4 space-y-4" id="recentActivity">
                            <!-- Activity items will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

@push('scripts')
<script>
// Check if user is authenticated
const token = localStorage.getItem('auth_token');
const loginModal = document.getElementById('loginModal');
const userMenu = document.getElementById('userMenu');
const userNameDisplay = document.getElementById('userNameDisplay');

// Show login modal if not authenticated
if (!token) {
    loginModal.classList.remove('hidden');
} else {
    // Show user menu if authenticated
    userMenu.classList.remove('hidden');
}

// Get user data
const user = JSON.parse(localStorage.getItem('user') || '{}');

// Update UI with user data
document.getElementById('userName').textContent = user.name || 'User';
document.getElementById('userEmail').textContent = user.email || '';
document.getElementById('userInitials').textContent = (user.name || 'U').charAt(0).toUpperCase();
userNameDisplay.textContent = user.name || 'User';

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store the token
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Hide modal and show user menu
            loginModal.classList.add('hidden');
            userMenu.classList.remove('hidden');
            
            // Update UI with user data
            document.getElementById('userName').textContent = data.user.name;
            document.getElementById('userEmail').textContent = data.user.email;
            document.getElementById('userInitials').textContent = data.user.name.charAt(0).toUpperCase();
            userNameDisplay.textContent = data.user.name;
            
            // Fetch dashboard data
            fetchDashboardData();
        } else {
            alert(data.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        });
        
        // Clear authentication data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        
        // Redirect to home page
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout. Please try again.');
    }
});

// Fetch dashboard data
async function fetchDashboardData() {
    try {
        const response = await fetch('/api/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token is invalid or expired
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                loginModal.classList.remove('hidden');
                userMenu.classList.add('hidden');
                return;
            }
            throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        
        // Update stats
        document.getElementById('totalMeetings').textContent = data.totalMeetings || 0;
        document.getElementById('pendingMeetings').textContent = data.pendingMeetings || 0;
        document.getElementById('approvedMeetings').textContent = data.approvedMeetings || 0;

        // Update recent activity
        const activityContainer = document.getElementById('recentActivity');
        if (data.recentActivity && data.recentActivity.length > 0) {
            activityContainer.innerHTML = data.recentActivity.map(activity => `
                <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                        <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span class="text-sm text-gray-500">${activity.type.charAt(0)}</span>
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900">${activity.title}</p>
                        <p class="text-sm text-gray-500">${activity.description}</p>
                    </div>
                </div>
            `).join('');
        } else {
            activityContainer.innerHTML = '<p class="text-sm text-gray-500">No recent activity</p>';
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        alert('Failed to load dashboard data. Please refresh the page.');
    }
}

// Fetch dashboard data when page loads (only if authenticated)
if (token) {
    fetchDashboardData();
}
</script>
@endpush
@endsection 