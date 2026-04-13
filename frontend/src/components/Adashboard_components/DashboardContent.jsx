import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, BookOpen, GraduationCap, FileText, Clock 
} from 'lucide-react';
import { 
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import './DashboardContent.css';

// Graph ka data
const earningsData = [
  { day: 'Jan', value: 2000 }, { day: 'Feb', value: 4500 },
  { day: 'Mar', value: 3000 }, { day: 'Apr', value: 6000 },
  { day: 'May', value: 4800 }, { day: 'Jun', value: 9000 },
];

const pieData = [
  { name: 'Web Dev', value: 45, color: '#4D8BFF' },
  { name: 'App Dev', value: 25, color: '#34D399' },
  { name: 'Data Sci', value: 20, color: '#FFD700' },
  { name: 'Design', value: 10, color: '#FF6B6B' },
];


const BarData = [
  { day: 'Mon', value: 4000 }, { day: 'Tue', value: 3000 },
  { day: 'Wed', value: 5000 }, { day: 'Thu', value: 2780 },
  { day: 'Fri', value: 1890 }, { day: 'Sat', value: 2390 },
  { day: 'Sun', value: 3490 },
];

// donut chart ke liye
const COLORS = ['#4D8BFF', '#34D399', '#FFD700', '#FF6B6B', '#8884d8'];

const DashboardContent = () => {
  // State Banayaein
  const [studentCount, setStudentCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [instructorCount, setInstructorCount] = useState(0);

  const [allStudents, setAllStudents] = useState([]); // 🌟 Sabhi students ka data store karne ke liye
  const [dynamicPieData, setDynamicPieData] = useState([]);
  //Data fetch karein
  useEffect(()=>{
    const fetchStats = async() => {
      try {
        // 1. Students Count fetch
        const res = await axios.get("http://localhost:8000/api/user/all");
        if(res.data.success){
            setStudentCount(res.data.count);
             setAllStudents(res.data.users); // 🌟 Dashboard data state mein set kiya
        }

        // 2. Course Count fetch
        const resCourse = await axios.get("http://localhost:8000/api/course/count-all");
        if(resCourse.data.success){
          setCourseCount(resCourse.data.count);
        }

        //Instructors count fetch
        const resInstructor = await axios.get("http://localhost:8000/api/user/instructors-count");
        if(resInstructor.data.success){
          setInstructorCount(resInstructor.data.count);
        }

        // 4. 🌟 Dynamic Course Category Stats fetch
        const resCategory = await axios.get("http://localhost:8000/api/course/category-stats");
        if (resCategory.data.success) {
          const formattedData = resCategory.data.stats.map((item, index) => ({
            name: item.name,
            value: item.value,
            color: COLORS[index % COLORS.length]
          }));
          setDynamicPieData(formattedData);
        }


      } catch (error){
        console.error("Error Fetching students:",error);
      }
    };
      fetchStats();
  }, []);

  // 🌟 LOGIC: allStudents data ko hafte ke dino mein convert karne ke liye
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

    if (allStudents && allStudents.length > 0) {
      allStudents.forEach(student => {
        if (student.createdAt) {
          const dayIndex = new Date(student.createdAt).getDay();
          counts[days[dayIndex]] += 1;
        }
      });
    }

    return Object.keys(counts).map(day => ({
      day: day,
      value: counts[day]
    }));
  };

  const dynamicBarData = getWeeklyData();

  return (
    <div className="lms-dashboard-wrapper">
      
      <div className="welcome-section" 
          style={{
                width: '100%',
                boxSizing: 'border-box',
                backgroundColor: '#E2C275',
                padding: '30px 40px',
                borderRadius: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
         }}>
        <h1 style={{
               margin: 0,
               fontSize: '2.5rem',
               fontWeight: '800', // 'bold' se badal kar '800' kar diya taaki zyada premium lage
               color: '#1a1a1a',
               fontFamily: 'Arial',
               lineHeight: '1.2'
         }}>
           Welcome back 👋  </h1>
      </div>
      {/* 2. TOP 4 STATS CARDS */}
      <div className="stats-grid-container">
        <div className="lms-card-stat">
          <div className="stat-icon bg-soft-blue"><Users className="text-blue" size={25} /></div>
          <div className="stat-content">
            <span className="stat-label">Total Students</span>
            {/* Yaha dynamic value display karenge */}
            <h2 className="stat-value">{studentCount.toLocaleString()}</h2>
          </div>
        </div>

        <div className="lms-card-stat">
          <div className="stat-icon bg-soft-yellow"><BookOpen className="text-yellow" size={24} /></div>
          <div className="stat-content">
            <span className="stat-label">Total Courses</span>
            <h2 className="stat-value">{courseCount.toLocaleString()}</h2>
          </div>
        </div>

        <div className="lms-card-stat">
          <div className="stat-icon bg-soft-green"><GraduationCap className="text-green" size={24} /></div>
          <div className="stat-content">
            <span className="stat-label">Total Instructors</span>
            <h2 className="stat-value">{instructorCount.toLocaleString()}</h2>
          </div>
        </div>
    </div>
        {/* <div className="lms-card-stat">
          <div className="stat-icon bg-soft-orange"><FileText className="text-orange" size={24} /></div>
          <div className="stat-content">
            <span className="stat-label">Assignments</span>
            <h2 className="stat-value">320</h2>
          </div>
        </div> */}
      

      
      
        {/* 🌟 3. NEW SECTION: COURSE STATISTICS (Donut Chart) */}
       {/* 2. 🌟 Separate Charts Section */}
      <div className="dashboard-grid-main mb-9">
        
        {/* Card 1: Course Categories (Doughnut) - Compact Layout */}
        <div className="chart-box" style={{ maxWidth: '480px', padding: '20px' }}> 
          <h3 className="font-bold text-gray-800 mb-8 text-base">Course Categories</h3>
          
          {/* 🌟 Flex container chart aur labels ko baju mein karne ke liye */}
          <div className="flex items-center gap-4">
            
            {/* Left side: Chart */}
            <div className="h-[200px] w-[220px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={dynamicPieData.length>0 ? dynamicPieData: [{name: 'Empty', value: 1, color: '#f3f4f'}]} 
                    innerRadius={50} 
                    outerRadius={70} 
                    paddingAngle={5} 
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Right side: Labels List */}
            <div className="flex flex-col gap-4" w-full>
              {dynamicPieData.length > 0 ? dynamicPieData.map((entry, index) => (
                <div key={index} className="flex items-center w-full gap-2">
                  <div className="flex items-center gap-2">
                  <span className="w-3.8 h-3.5 rounded-full" style={{backgroundColor: entry.color}}></span> 
                  <span className="text-[15px] font-bold text-gray-600 uppercase tracking-tight">
                    {entry.name}
                  </span>
                  </div>
                </div>
              )) : <p className="text-gray-400 text-sm italic">No Categories Found</p>}
            </div>
          </div>
        </div>

        {/* Card 2: Weekly Activity (Bar Chart) */}
        <div className="chart-box" 
          style={{ 
            backgroundColor: 'white', 
            padding: '24px', 
            borderRadius: '24px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #f0f0f0',
            flex: 1, 
            minWidth: '400px',
            marginTop: '20px'
          }}>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Weekly Student Activity</h3>
            <p className="text-xs text-gray-400">New registrations per day</p>
          </div>
        </div>

        <div style={{ height: '240px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dynamicBarData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#9CA3AF'}} 
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: '#F9F6EE'}} 
                contentStyle={{borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
              />
              <Bar 
                dataKey="value" 
                fill="#D4A843" 
                radius={[6, 6, 0, 0]} 
                barSize={30} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      </div>


      {/* 3. NICHE KE DONO GRAPHS (Wapas add kar diye hain) */}
      <div className="dashboard-main-layout">
        
        {/* Left: Earnings Area Chart */}
        {/* <div className="lms-card-main chart-box">
          <div className="card-header-box">
            <h3>Earnings Overview</h3>
            <div className="amount-highlight">$12,450 <span>this month</span></div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4D8BFF" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4D8BFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#A0AEC0'}} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#4D8BFF" strokeWidth={3} fill="url(#colorArea)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        {/* Right: Recent Registrations List */}
        <div className="lms-card-main registration-box">
          <div className="card-header-box">
            <h3>Recent Registrations</h3>
          </div>
          <div className="registration-list">
            {[
              { name: 'Ayesha Khan', email: 'ayesha@gmail.com', time: '2h ago' },
              { name: 'Rahul Sharma', email: 'rahul@gmail.com', time: '16h ago' },
              { name: 'Priya Mehta', email: 'priya@gmail.com', time: '20h ago' },
              { name: 'Amit Verma', email: 'amit@gmail.com', time: '22h ago' },
            ].map((user, idx) => (
              <div key={idx} className="student-list-item">
                <div className="avatar-placeholder">{user.name.charAt(0)}</div>
                <div className="user-details">
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                </div>
                <div className="time-info"><Clock size={12} /> {user.time}</div>
              </div>
            ))}
          </div>
        </div>
        

      </div>
    </div>
    
  );
};

export default DashboardContent;