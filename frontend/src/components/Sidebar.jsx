import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, BookOpen, ClipboardList, Brain,
    CalendarCheck, LifeBuoy, LogOut, GraduationCap, TrendingUp, Briefcase, Users
} from 'lucide-react';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/assignments', label: 'Assignments', icon: ClipboardList },
    { path: '/quizzes', label: 'Quizzes', icon: Brain },
    { path: '/attendance', label: 'Attendance', icon: CalendarCheck },
    { path: '/support', label: 'Learning Support', icon: LifeBuoy },
    { path: '/analytics', label: 'Analytics', icon: TrendingUp },
    { path: '/jobs', label: 'Jobs & Internships', icon: Briefcase },
    { path: '/alumni', label: 'Alumni Network', icon: Users },
];

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.name
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'ST';

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <GraduationCap size={22} color="white" />
                </div>
                <div>
                    <h2>NavKalpana</h2>
                    <p>Learning Platform</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Icon size={18} className="nav-icon" />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-card">
                    <div className="user-avatar">{initials}</div>
                    <div className="user-info">
                        <div className="user-name">{user?.name || 'Student'}</div>
                        <div className="user-role">Student</div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout} title="Logout">
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
