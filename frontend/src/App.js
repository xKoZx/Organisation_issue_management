import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Aboutus from './Aboutus';
import Speakui from './Speak';
import IssueWindow from './Issue_window';
import Reportstatus from './Reportstatus';
import Report from './ReportC'
import Admin from './admin'
import User from './Users'
import Staffs from './Staffs'
import Inspect from './Inspect'
import Stafpage from'./staffpage'
import IssueView from './view_issue'
import Chatroom from './chatroom'
import LiveChat from './Livechat';
import StatusUpdate from './statusupdate'
import SpeakView from './speak-view';
import LiveView from './live-view';
import WindowView from './window-view';
import StaffChatbotView from './staff-chatbotview'
import StaffWindowview from './staff-windowview'
import Adminreport from './adminreportstatus'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<Aboutus />} />
        <Route path="/speak" element={<Speakui />} />
        <Route path="/issue" element={<IssueWindow />} />
        <Route path="/report" element={<Report />} />
        <Route path="/report-status" element={<Reportstatus />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/admin" element={<Admin/>} />
        <Route path="/users" element={<User/>} />
        <Route path="/staffs" element={<Staffs/>} />
        <Route path="/inspect" element={<Inspect/>} />
        <Route path="/stpage" element={<Stafpage/>} />
        <Route path="/issue-view" element={<IssueView />} />
        <Route path="/chatroom" element={<Chatroom />} />
        <Route path="/livechat" element={<LiveChat />} />
        <Route path="/statusupdate" element={<StatusUpdate />} />
        <Route path="/speak-view" element={<SpeakView />} />
        <Route path="/live-view" element={<LiveView />} />
        <Route path="/window-view" element={<WindowView />} />
        <Route path="/staff-chatbotview" element={<StaffChatbotView />} />
        <Route path="/staff-windowview" element={<StaffWindowview />} />
        <Route path="/admin-status" element={<Adminreport />} />
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
