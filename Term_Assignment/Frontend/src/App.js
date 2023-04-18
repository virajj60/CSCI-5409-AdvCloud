import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import PostList from './components/PostList/PostList';
import PostDetails from './components/PostDetails/PostDetails';
import AddPost from './components/AddPost/AddPost';
import SignUp from './components/Signup/Signup';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/postDetails" element={<PostDetails />} />
        <Route path="/addPost" element={<AddPost />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}
export default App;
