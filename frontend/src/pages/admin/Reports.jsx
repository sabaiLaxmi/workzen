import React, { useState, useEffect } from 'react';
import { getProjectReport, getEmployeeReport } from '../../api/reportApi';
import { getProjects } from '../../api/projectApi';
import { getUsers } from '../../api/userApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Skeleton from '../../components/common/Skeleton';
import './DashboardStyles.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'var(--paper)', border: '1px solid var(--line)', borderRadius: '4px', padding: '0.5rem', fontFamily: '"IBM Plex Sans", sans-serif' }}>
        <p style={{ margin: 0, fontWeight: '500', color: 'var(--ink)' }}>{label}</p>
        <p style={{ margin: 0, color: 'var(--pine)', fontWeight: '600' }}>
          {`${payload[0].value} hours`}
        </p>
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const [view, setView] = useState('project'); // 'project' or 'employee'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReports = async () => {
      try {
        setLoading(true);
        setError('');
        setData([]);
        setExpandedId(null);
        
        let reportData = [];

        if (view === 'project') {
          const projects = await getProjects();
          const reports = await Promise.all(
            projects.map(p => getProjectReport(p._id).catch(() => null))
          );
          
          reportData = reports.filter(r => r !== null).map(r => ({
            id: r.project.id,
            name: r.project.name,
            totalHours: r.totalProjectHours,
            breakdown: r.employeeBreakdown.map(b => ({
              id: b.employeeId,
              name: b.employeeName,
              hours: b.totalHours
            }))
          }));
        } else {
          const users = await getUsers();
          const reports = await Promise.all(
            users.map(u => getEmployeeReport(u._id).catch(() => null))
          );
          
          reportData = reports.filter(r => r !== null).map(r => ({
            id: r.employee.id,
            name: r.employee.name,
            totalHours: r.totalEmployeeHours,
            breakdown: r.projectBreakdown.map(b => ({
              id: b.projectId,
              name: b.projectName,
              hours: b.totalHours
            }))
          }));
        }

        // Sort by total hours descending
        reportData.sort((a, b) => b.totalHours - a.totalHours);

        if (isMounted) {
          setData(reportData);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch reports data.');
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReports();

    return () => { isMounted = false; };
  }, [view]);

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const chartData = data.map(item => ({
    name: item.name,
    hours: item.totalHours
  }));

  const chartTitle = view === 'project' ? 'Hours by Project' : 'Hours by Employee';
  const tableTitle = view === 'project' ? 'Projects Breakdown' : 'Employees Breakdown';
  const breakdownLabel = view === 'project' ? 'Employee' : 'Project';

  return (
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 2rem' }}>
        <h2 className="dashboard-section-title" style={{ margin: 0 }}>Reports</h2>
        
        {/* Filter Segmented Control */}
        <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'var(--paper-raised)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--line)' }}>
          {[
            { label: 'By Project', val: 'project' },
            { label: 'By Employee', val: 'employee' }
          ].map(f => (
            <button
              key={f.val}
              className={view === f.val ? 'btn-filled' : 'btn-ghost'}
              style={{ 
                padding: '0.4rem 1rem', 
                fontSize: '0.85rem',
                border: view === f.val ? '1px solid transparent' : '1px solid transparent',
                backgroundColor: view === f.val ? 'var(--pine)' : 'transparent',
                color: view === f.val ? '#fff' : 'var(--ink-soft)'
              }}
              onClick={() => setView(f.val)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div style={{ padding: '1.5rem', border: '1px solid var(--brick)', borderRadius: '4px', backgroundColor: 'rgba(193, 85, 77, 0.05)', color: 'var(--brick)' }}>
          <strong>Error: </strong> {error}
        </div>
      ) : (
        <>
          <div className="panel" style={{ padding: '2rem', height: '400px', marginBottom: '2rem' }}>
            <h3 style={{ fontFamily: '"Fraunces", serif', fontSize: '1.25rem', margin: '0 0 1.5rem', color: 'var(--ink)' }}>
              {chartTitle}
            </h3>
            
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '80%', paddingBottom: '20px' }}>
                <Skeleton height="60%" style={{ flex: 1, borderRadius: '4px 4px 0 0' }} />
                <Skeleton height="100%" style={{ flex: 1, borderRadius: '4px 4px 0 0' }} />
                <Skeleton height="30%" style={{ flex: 1, borderRadius: '4px 4px 0 0' }} />
                <Skeleton height="80%" style={{ flex: 1, borderRadius: '4px 4px 0 0' }} />
                <Skeleton height="50%" style={{ flex: 1, borderRadius: '4px 4px 0 0' }} />
              </div>
            ) : data.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%', color: 'var(--ink-soft)' }}>
                No data yet for this period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="name" tick={{ fill: 'var(--ink-soft)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--ink-soft)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                  <Bar dataKey="hours" fill="var(--pine)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="panel list-panel">
            <div className="panel-header" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontFamily: '"Fraunces", serif', fontSize: '1.25rem', margin: 0, color: 'var(--ink)' }}>
                {tableTitle}
              </h3>
            </div>
            {loading ? (
              <div className="skeleton-list">
                <Skeleton height="56px" />
                <Skeleton height="56px" />
                <Skeleton height="56px" />
              </div>
            ) : data.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--ink-soft)' }}>
                No data yet for this period.
              </div>
            ) : (
              <div className="data-list">
                {data.map(item => (
                  <div key={item.id} className="hairline-row" style={{ display: 'block' }}>
                    <div 
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: item.breakdown.length > 0 ? 'pointer' : 'default' }}
                      onClick={() => item.breakdown.length > 0 && toggleExpand(item.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {item.breakdown.length > 0 && (
                          <svg 
                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ 
                              color: 'var(--ink-soft)', 
                              transition: 'transform 0.2s',
                              transform: expandedId === item.id ? 'rotate(90deg)' : 'rotate(0deg)'
                            }}
                          >
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        )}
                        <strong className="row-title" style={{ marginLeft: item.breakdown.length > 0 ? 0 : '1.5rem' }}>
                          {item.name}
                        </strong>
                      </div>
                      <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: '500', color: 'var(--pine)' }}>
                        {item.totalHours} hrs
                      </div>
                    </div>
                    
                    {expandedId === item.id && item.breakdown.length > 0 && (
                      <div style={{ marginTop: '1rem', paddingLeft: '2.25rem', paddingRight: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--ink-soft)', paddingBottom: '0.5rem', borderBottom: '1px solid var(--line)' }}>
                          <span>{breakdownLabel}</span>
                          <span>Hours</span>
                        </div>
                        {item.breakdown.map(b => (
                          <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--line)', fontSize: '0.9rem' }}>
                            <span style={{ color: 'var(--ink)' }}>{b.name}</span>
                            <span style={{ fontFamily: '"IBM Plex Mono", monospace', color: 'var(--ink-soft)' }}>{b.hours}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
