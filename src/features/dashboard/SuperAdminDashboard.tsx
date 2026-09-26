import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  ButtonGroup,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import DownloadIcon from '@mui/icons-material/Download';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlaceIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';

// Data for Revenue & Bookings Trajectory
const chartData7D = [
  { time: 'Mon', revenue: 32000, bookings: 22, previous: 26000 },
  { time: 'Tue', revenue: 28000, bookings: 19, previous: 24000 },
  { time: 'Wed', revenue: 45000, bookings: 31, previous: 33000 },
  { time: 'Thu', revenue: 39000, bookings: 26, previous: 35000 },
  { time: 'Fri', revenue: 68000, bookings: 48, previous: 52000 },
  { time: 'Sat', revenue: 94000, bookings: 65, previous: 78000 },
  { time: 'Sun', revenue: 105000, bookings: 74, previous: 85000 },
];

const chartData30D = [
  { time: 'Week 1', revenue: 185000, bookings: 130, previous: 150000 },
  { time: 'Week 2', revenue: 225000, bookings: 160, previous: 180000 },
  { time: 'Week 3', revenue: 210000, bookings: 145, previous: 190000 },
  { time: 'Week 4', revenue: 290000, bookings: 205, previous: 220000 },
];

const chartData1Y = [
  { time: 'Jan', revenue: 520000, bookings: 360, previous: 410000 },
  { time: 'Feb', revenue: 580000, bookings: 410, previous: 460000 },
  { time: 'Mar', revenue: 670000, bookings: 470, previous: 510000 },
  { time: 'Apr', revenue: 620000, bookings: 430, previous: 540000 },
  { time: 'May', revenue: 780000, bookings: 550, previous: 610000 },
  { time: 'Jun', revenue: 850000, bookings: 600, previous: 680000 },
  { time: 'Jul', revenue: 810000, bookings: 570, previous: 690000 },
  { time: 'Aug', revenue: 890000, bookings: 630, previous: 720000 },
  { time: 'Sep', revenue: 980000, bookings: 690, previous: 790000 },
];

// Peak Hours Slot Data
const peakHoursData = [
  { hour: '06 AM', occupancy: 70 },
  { hour: '08 AM', occupancy: 85 },
  { hour: '10 AM', occupancy: 40 },
  { hour: '12 PM', occupancy: 25 },
  { hour: '02 PM', occupancy: 30 },
  { hour: '04 PM', occupancy: 55 },
  { hour: '06 PM', occupancy: 92 },
  { hour: '08 PM', occupancy: 98 },
  { hour: '10 PM', occupancy: 94 },
  { hour: '12 AM', occupancy: 75 },
];

// Recent Bookings Data
const liveBookings = [
  {
    id: 'BK-9481',
    player: 'Hardik Patel',
    avatar: 'https://ui-avatars.com/api/?name=Hardik+P&background=10b981&color=fff',
    arena: 'PowerPlay Turf (Pitch 1)',
    city: 'Ahmedabad',
    time: 'Today • 08:00 PM - 10:00 PM',
    amount: '₹2,600',
    status: 'Confirmed',
    payment: 'Paid Online',
  },
  {
    id: 'BK-9480',
    player: 'Ankit Mehta',
    avatar: 'https://ui-avatars.com/api/?name=Ankit+M&background=3b82f6&color=fff',
    arena: 'SkyArena Box Cricket',
    city: 'Surat',
    time: 'Today • 09:30 PM - 11:30 PM',
    amount: '₹3,200',
    status: 'Confirmed',
    payment: 'Paid Online',
  },
  {
    id: 'BK-9479',
    player: 'Karan Sharma',
    avatar: 'https://ui-avatars.com/api/?name=Karan+S&background=8b5cf6&color=fff',
    arena: 'Lords Turf Stadium',
    city: 'Vadodara',
    time: 'Tomorrow • 06:00 AM - 08:00 AM',
    amount: '₹1,800',
    status: 'Pending',
    payment: 'Pay at Venue',
  },
  {
    id: 'BK-9478',
    player: 'Meet Trivedi',
    avatar: 'https://ui-avatars.com/api/?name=Meet+T&background=f59e0b&color=fff',
    arena: 'Sixers Cricket Arena',
    city: 'Rajkot',
    time: 'Tomorrow • 07:00 PM - 09:00 PM',
    amount: '₹2,400',
    status: 'Confirmed',
    payment: 'Paid Online',
  },
];

// Top Ranked Venues
const rankedVenues = [
  { name: 'PowerPlay Turf (Pitch 1 & 2)', city: 'Ahmedabad', rating: 4.9, bookings: 432, occupancy: 94 },
  { name: 'SkyArena Cricket Arena', city: 'Surat', rating: 4.8, bookings: 388, occupancy: 89 },
  { name: 'Lords Turf Stadium', city: 'Vadodara', rating: 4.7, bookings: 310, occupancy: 78 },
  { name: 'Sixers Cricket Ground', city: 'Rajkot', rating: 4.6, bookings: 245, occupancy: 68 },
];

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'7D' | '30D' | '1Y'>('7D');
  const [metricView, setMetricView] = useState<'revenue' | 'bookings'>('revenue');

  const getChartData = () => {
    if (period === '7D') return chartData7D;
    if (period === '30D') return chartData30D;
    return chartData1Y;
  };

  return (
    <Box sx={{ width: '100%', minWidth: 0, pb: 4 }}>

      {/* 1. Header Hero Banner */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          p: { xs: 2.5, sm: 3.5 },
          mb: 3.5,
          borderRadius: 3.5,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0) 70%)',
          }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 3,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.02em' }}>
                Super Admin Command Center
              </Typography>
              <Chip
                label="LIVE SYSTEM"
                size="small"
                icon={<FlashOnIcon sx={{ fontSize: '14px !important', color: '#10b981' }} />}
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  height: 22,
                }}
              />
            </Stack>
            <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: 650 }}>
              Manage multi-city cricket arenas, real-time match slot bookings, turnover payouts, and regional configurations.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/countries')}
              sx={{
                bgcolor: '#10b981',
                color: 'white',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2.5,
                px: 2.5,
                py: 1,
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                '&:hover': { bgcolor: '#059669' },
              }}
            >
              Add Location
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{
                color: 'white',
                borderColor: 'rgba(255,255,255,0.2)',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2.5,
                px: 2,
                py: 1,
                bgcolor: 'rgba(255,255,255,0.05)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.4)' },
              }}
            >
              Export Report
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* 2. Key Performance Metric Cards */}
      <Box sx={{ width: '100%', mb: 3.5 }}>
        <Grid container spacing={2.5}>
          {[
            {
              title: 'Gross Platform Revenue',
              value: '₹8,42,900',
              trend: '+22.4%',
              isUp: true,
              sub: 'vs last month',
              icon: <AttachMoneyIcon sx={{ color: '#10b981', fontSize: 26 }} />,
              iconBg: '#ecfdf5',
              borderHover: '#10b981',
            },
            {
              title: 'Total Turf Bookings',
              value: '3,140',
              trend: '+16.8%',
              isUp: true,
              sub: 'vs last month',
              icon: <CalendarMonthIcon sx={{ color: '#3b82f6', fontSize: 24 }} />,
              iconBg: '#eff6ff',
              borderHover: '#3b82f6',
            },
            {
              title: 'Active Arenas & Turfs',
              value: '64',
              trend: '+6 Added',
              isUp: true,
              sub: 'across 4 cities',
              icon: <SportsCricketIcon sx={{ color: '#f59e0b', fontSize: 26 }} />,
              iconBg: '#fffbeb',
              borderHover: '#f59e0b',
            },
            {
              title: 'Registered Cricketers',
              value: '18,650',
              trend: '+1.2k',
              isUp: true,
              sub: 'active players',
              icon: <PeopleIcon sx={{ color: '#8b5cf6', fontSize: 26 }} />,
              iconBg: '#f5f3ff',
              borderHover: '#8b5cf6',
            },
          ].map((kpi, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'white',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease-in-out',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                    borderColor: kpi.borderHover,
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography
                    variant="body2"
                    fontWeight="600"
                    sx={{
                      color: '#64748b',
                      fontSize: '0.85rem',
                    }}
                  >
                    {kpi.title}
                  </Typography>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      bgcolor: kpi.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {kpi.icon}
                  </Box>
                </Box>

                <Box sx={{ mb: 1.5 }}>
                  <Typography
                    variant="h4"
                    fontWeight="800"
                    sx={{ color: '#0f172a', letterSpacing: '-0.02em', fontSize: '2rem' }}
                  >
                    {kpi.value}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    icon={kpi.isUp ? <TrendingUpIcon sx={{ fontSize: '14px !important' }} /> : <TrendingDownIcon sx={{ fontSize: '14px !important' }} />}
                    label={kpi.trend}
                    size="small"
                    sx={{
                      bgcolor: kpi.isUp ? '#ecfdf5' : '#fef2f2',
                      color: kpi.isUp ? '#059669' : '#dc2626',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      height: 22,
                      borderRadius: 1.5,
                      border: `1px solid ${kpi.isUp ? '#a7f3d0' : '#fecaca'}`,
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                    {kpi.sub}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 3. Main Full-Width Analytics Chart Paper */}
      <Box sx={{ width: '100%', minWidth: 0, mb: 3.5 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 3.5,
            bgcolor: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="800" sx={{ color: '#0f172a' }}>
                Platform Revenue & Utilization
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Compare turnover trajectory and match booking velocity
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <ButtonGroup size="small" sx={{ bgcolor: '#f8fafc', p: 0.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                {(['revenue', 'bookings'] as const).map((mode) => (
                  <Button
                    key={mode}
                    onClick={() => setMetricView(mode)}
                    sx={{
                      border: 'none !important',
                      borderRadius: '6px !important',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      textTransform: 'none',
                      px: 1.5,
                      py: 0.4,
                      bgcolor: metricView === mode ? '#0f172a' : 'transparent',
                      color: metricView === mode ? 'white' : '#64748b',
                      '&:hover': { bgcolor: metricView === mode ? '#0f172a' : '#f1f5f9' },
                    }}
                  >
                    {mode === 'revenue' ? 'Revenue (₹)' : 'Bookings'}
                  </Button>
                ))}
              </ButtonGroup>

              <ButtonGroup size="small" sx={{ bgcolor: '#f8fafc', p: 0.5, borderRadius: 2, border: '1px solid #e2e8f0' }}>
                {(['7D', '30D', '1Y'] as const).map((r) => (
                  <Button
                    key={r}
                    onClick={() => setPeriod(r)}
                    sx={{
                      border: 'none !important',
                      borderRadius: '6px !important',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      textTransform: 'none',
                      px: 1.2,
                      py: 0.4,
                      bgcolor: period === r ? 'white' : 'transparent',
                      color: period === r ? '#0f172a' : '#64748b',
                      boxShadow: period === r ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      '&:hover': { bgcolor: period === r ? 'white' : '#f1f5f9' },
                    }}
                  >
                    {r}
                  </Button>
                ))}
              </ButtonGroup>
            </Stack>
          </Box>

          {/* Recharts Area Container - Fully Responsive 100% Width */}
          <Box sx={{ width: '100%', height: 350, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
              <AreaChart data={getChartData()} margin={{ top: 15, right: 35, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="previousGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) =>
                    metricView === 'revenue' ? `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}` : val
                  }
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: 10,
                    border: 'none',
                    color: 'white',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    fontSize: 12,
                    padding: '10px 14px',
                  }}
                  formatter={(val: any, name: any) => [
                    metricView === 'revenue' ? `₹${Number(val).toLocaleString()}` : val,
                    name === 'revenue' ? 'Current' : 'Previous Period',
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey={metricView}
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#primaryGradient)"
                />
                {metricView === 'revenue' && (
                  <Area
                    type="monotone"
                    dataKey="previous"
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#previousGradient)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>

      {/* 4. Secondary Row (Peak Hours + Ranked Arenas) */}
      <Box sx={{ width: '100%', mb: 3.5 }}>
        <Grid container spacing={3}>
          {/* Peak Slot Demand Hourly Bar Chart */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: 3.5,
                bgcolor: 'white',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" fontWeight="800" sx={{ color: '#0f172a' }}>
                    Peak Slot Demand
                  </Typography>
                  <Chip
                    label="Prime 8-11 PM"
                    size="small"
                    sx={{ bgcolor: '#fef3c7', color: '#b45309', fontWeight: 700, fontSize: '0.7rem' }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  Hourly turf occupancy rate across all arenas
                </Typography>
              </Box>

              <Box sx={{ width: '100%', height: 230, minWidth: 0, my: 2 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                  <BarChart data={peakHoursData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} unit="%" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: 8,
                        border: 'none',
                        color: 'white',
                        fontSize: 12,
                      }}
                      formatter={(val: any) => [`${val}% Occupied`, 'Demand']}
                    />
                    <Bar dataKey="occupancy" fill="#0f172a" radius={[6, 6, 0, 0]} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AccessTimeIcon sx={{ color: '#10b981', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" fontWeight="700" color="#0f172a" display="block">
                      Night Slots Occupancy: 98%
                    </Typography>
                    <Typography variant="caption" color="#64748b">
                      Highest weekend turnout
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" fontWeight="800" color="#10b981">
                  +34% Rev
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Top Performing Venues Ranking */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3.5,
                borderRadius: 3.5,
                bgcolor: 'white',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Box>
                  <Typography variant="h6" fontWeight="800" sx={{ color: '#0f172a' }}>
                    Top Ranked Arenas
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Highest rated by cricketers
                  </Typography>
                </Box>
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Box>

              <Stack spacing={2}>
                {rankedVenues.map((v, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      border: '1px solid #f1f5f9',
                      bgcolor: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: '#f1f5f9', borderColor: '#e2e8f0' },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          bgcolor: i === 0 ? '#10b981' : '#e2e8f0',
                          color: i === 0 ? 'white' : '#0f172a',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                        }}
                      >
                        {i + 1}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="700" color="#0f172a">
                          {v.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PlaceIcon sx={{ fontSize: 13, color: '#94a3b8' }} />
                          <Typography variant="caption" color="#64748b">
                            {v.city} • {v.bookings} matches
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.4 }}>
                        <StarIcon sx={{ fontSize: 15, color: '#f59e0b' }} />
                        <Typography variant="body2" fontWeight="800" color="#0f172a">
                          {v.rating}
                        </Typography>
                      </Box>
                      <Typography variant="caption" fontWeight="600" color="#10b981">
                        {v.occupancy}% booked
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/countries')}
                sx={{
                  mt: 3,
                  borderColor: '#e2e8f0',
                  color: '#0f172a',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2.5,
                  py: 1,
                  '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' },
                }}
              >
                Manage Arenas & Pricing
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* 5. Live Bookings Table - FULL WIDTH */}
      <Box sx={{ width: '100%', minWidth: 0 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3.5,
            bgcolor: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          <Box sx={{ p: 3, px: 3.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" fontWeight="800" sx={{ color: '#0f172a' }}>
                Live Match Bookings & Payouts
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Real-time transaction stream from player mobile apps
              </Typography>
            </Box>
            <Button
              size="small"
              endIcon={<ArrowForwardIcon fontSize="small" />}
              sx={{ textTransform: 'none', fontWeight: 700, color: '#10b981' }}
            >
              View Full Ledger
            </Button>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 600 }}>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', py: 1.5 }}>BOOKING REF</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', py: 1.5 }}>PLAYER</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', py: 1.5 }}>TURF & ARENA</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', py: 1.5 }}>TIME SLOT</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', py: 1.5 }}>AMOUNT</TableCell>
                  <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.75rem', py: 1.5 }}>STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {liveBookings.map((row) => (
                  <TableRow key={row.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                    <TableCell sx={{ color: '#64748b', fontWeight: 700, fontSize: '0.8rem' }}>
                      {row.id}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={row.avatar} sx={{ width: 32, height: 32 }} />
                        <Typography variant="body2" fontWeight="700" sx={{ color: '#0f172a' }}>
                          {row.player}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#1e293b', fontWeight: 600 }}>
                        {row.arena}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                        {row.city}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#475569', fontSize: '0.8rem', fontWeight: 500 }}>
                      {row.time}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="800" sx={{ color: '#0f172a' }}>
                        {row.amount}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#059669', fontWeight: 600 }}>
                        {row.payment}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          height: 24,
                          borderRadius: 1.5,
                          bgcolor: row.status === 'Confirmed' ? '#ecfdf5' : '#fffbeb',
                          color: row.status === 'Confirmed' ? '#059669' : '#b45309',
                          border: row.status === 'Confirmed' ? '1px solid #a7f3d0' : '1px solid #fde68a',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
}
