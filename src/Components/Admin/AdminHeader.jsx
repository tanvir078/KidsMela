import { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, ChevronDown, LogOut } from 'lucide-react';

export default function AdminHeader() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                3
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-bold text-slate-900">Notifications</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-slate-50">
                    <p className="text-sm font-semibold text-slate-800">New order received</p>
                    <p className="text-xs text-slate-500">Order #1234 placed 2 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-slate-50">
                    <p className="text-sm font-semibold text-slate-800">Low stock alert</p>
                    <p className="text-xs text-slate-500">5 products are running low</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-slate-50">
                    <p className="text-sm font-semibold text-slate-800">New customer registered</p>
                    <p className="text-xs text-slate-500">John Doe joined 10 minutes ago</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 px-4 py-2">
                  <button className="w-full text-center text-sm font-semibold text-rose-600 hover:text-rose-700">
                    View All
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-fuchsia-600 text-sm font-bold text-white">
                A
              </div>
              <span>Admin</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="font-bold text-slate-900">Admin User</p>
                  <p className="text-xs text-slate-500">admin@kidsmela.com</p>
                </div>
                <div className="py-2">
                  <button className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                    <User className="h-4 w-4" />
                    My Account
                  </button>
                  <button className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                    Activity Logs
                  </button>
                  <button className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                    Preferences
                  </button>
                </div>
                <div className="border-t border-slate-100 pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
