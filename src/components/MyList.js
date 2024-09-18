import React, { useState, useEffect } from 'react';
import NewSummary from './NewSummary.js';
import "../assets/css/MyList.css";
import Pagination from'@mui/material/Pagination';
import { useAuth } from '../contexts/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

const MyList = () => {
  const [activeTab, setActiveTab] = useState('pendingAtApprover1 || pendingAtApprover2');
  const [data, setData] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemTravelInfo, setSelectedItemTravelInfo] = useState({});
  const [selectedItemAttachmentsInfo, setSelectedItemAttachmentsInfo] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentEmailAddress, setEmailAddress] = useState(null);
  const navigate = useNavigate();


  // const username = process.env.REACT_APP_USERNAME;
  // const password =  process.env.REACT_APP_PASSWORD;
  // const authHeader = 'Basic ' + btoa(username + ':' + password);

  // const currentUserId = 33801;

  const { auth, login } = useAuth();// Access auth from context
  const { username, password } = auth;
  const authHeader = 'Basic ' + btoa(username + ':' + password);


  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername && storedPassword && (username !== storedUsername || password !== storedPassword)) {
      login(storedUsername, storedPassword);
    }
  }, [login, username, password]);


  const fetchUserId = async () => {
    try {
      const response = await fetch('http://localhost:8080/o/headless-admin-user/v1.0/my-user-account', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': authHeader,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const user = await response.json();
      console.log("users",user);
      setCurrentUserId(user.id);
      setEmailAddress(user.emailAddress);
      console.log(user.id);
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  // useEffect(() => {
  //   fetchUserId();
  // },);

  useEffect(() => {
    if (username && password) {
      fetchUserId();
    }
  }, [username, password]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleRowClick = async (item) => {
    setSelectedItem(item);
    try {
      const response = await fetch(`http://localhost:8080/o/c/travelinfos/${item.id}/itineraryRelation`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': authHeader,
        },
      });

      const attachmentResponse = await fetch(`http://localhost:8080/o/c/travelattachments?filter=r_attachmentRelation_c_travelInfoId eq \'${item.id}\'`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': authHeader,
        },
      });

      const attachmentInfo = await attachmentResponse.json()
      console.log("attachments : " , attachmentInfo.items)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      if (!attachmentResponse.ok) {
        throw new Error(`HTTP error! Status: ${attachmentResponse.status}`);
      }

      const travelInfo = await response.json();
      console.log('Travel Information Response:', travelInfo);
      setSelectedItemTravelInfo(travelInfo.items || []); // Ensure it's an array
      setSelectedItemAttachmentsInfo(attachmentInfo.items || []);
    } catch (error) {
      console.error('Error fetching travel information:', error);
      setSelectedItemTravelInfo([]);
    }
  };


  const handleBack = () => {
    setSelectedItem(null);
    setSelectedItemTravelInfo(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (event,newPage) => {
    setCurrentPage(newPage);
  };

  // const handleEditClick = (item) => {
  //   navigate('/EditTravelRequestForm', { state: { item} });
  // };

  const handleEditClick = (item) => {
    // Use the item id to fetch the associated travel information
    const fetchTravelInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/o/c/travelinfos/${item.id}/itineraryRelation`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': authHeader,
          },
        });
        const attachmentResponse = await fetch(`http://localhost:8080/o/c/travelattachments?filter=r_attachmentRelation_c_travelInfoId eq \'${item.id}\'`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': authHeader,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        if (!attachmentResponse.ok) {
          throw new Error(`HTTP error! Status: ${attachmentResponse.status}`);
        }

        const travelInfo = await response.json();
        const attachmentInfo = await attachmentResponse.json();
        navigate('/EditTravelRequestForm', { state: { item, travelInfo: travelInfo.items || [], attachmentInfo: attachmentInfo.items || [] } });
      } catch (error) {
        console.error('Error fetching travel information:', error);
        navigate('/EditTravelRequestForm', { state: { item, travelInfo: [] } });
      }
    };

    fetchTravelInfo();
  };



  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/o/c/travelinfos/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': authHeader,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Refresh the data after deletion
      setData(prevData => ({
        ...prevData,
        items: prevData.items.filter(item => item.id !== id)
      }));

      console.log(`Item with id ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };



  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8080/o/c/travelinfos/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': authHeader,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authHeader]);

  const filteredData = data.items
    // .filter(item =>  item.creator?.id === currentUserId)
    // .filter(item =>  item.email === currentUserId)
    // .filter(item => item.status?.label === activeTab)

    // .filter(item => item.email !== currentUserId)
    // .filter(item => item.status?.label === activeTab || activeTab === 'all')

    .filter(item => {
      if (activeTab === 'all') {
        return  item.email !== currentEmailAddress &&  item.creator?.id === currentUserId  &&
          (item.approveStatus?.key === activeTab || activeTab === 'all');
      } 
      else if (activeTab === 'pendingAtApprover1 || pendingAtApprover2') {
        return item.email === currentEmailAddress &&  item.creator?.id === currentUserId  &&
         (item.approveStatus?.key === 'pendingAtApprover1' || item.approveStatus?.key === 'pendingAtApprover2');
      }
      else {
        return item.email === currentEmailAddress && item.creator?.id === currentUserId  &&
          item.approveStatus?.key === activeTab;
      }
    })

    .filter(item => item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || item.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const totalPages = Math.ceil(data.items.length / itemsPerPage);

  return (
    <div className="dashboard">
      {selectedItem ? (
       <NewSummary
       item={selectedItem}
       travelInfo={selectedItemTravelInfo}
       attachmentInfo={selectedItemAttachmentsInfo}
       onBack={handleBack}
     />
      ) : (
        <>
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === 'pendingAtApprover1 || pendingAtApprover2' ? 'active' : ''}`}
              onClick={() => handleTabClick('pendingAtApprover1 || pendingAtApprover2')}
            >
              In Progress Requests
            </button>
            <button
              className={`tab-button ${activeTab === 'draft' ? 'active' : ''}`}
              onClick={() => handleTabClick('draft')}
            >
              Draft Requests
            </button>
            <button
              className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => handleTabClick('approved')}
            >
              Approved Requests
            </button>
            <button
              className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => handleTabClick('cancelled')}
            >
              Cancelled Requests
            </button>
            <button
              className={`tab-button ${activeTab === 'rejected' ? 'active' : ''}`}
              onClick={() => handleTabClick('rejected')}
            >
              Denied Requests
            </button>
            <button
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => handleTabClick('all')}
            >
              Created for others
            </button>
          </div>

          <div className="search-box-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-box"
            />
          </div>

          <div className="toolbar2">
            <div className="toolbar2-content">
              <span>
              {activeTab === 'pendingAtApprover1 || pendingAtApprover2' && 'My In-Progress Requests'}
              {activeTab === 'draft' && 'My Draft Requests'}
              {activeTab === 'approved' && 'My Approved Requests'}
              {activeTab === 'cancelled' && 'My Cancelled Requests'}
              {activeTab === 'rejected' && 'My Denied Requests'}
              {activeTab === 'all' && 'All Requests'}
              </span>
            </div>
          </div>

          <div className="tab-content">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <>
                <table className="table-mylist">
                  <thead className='thead'>
                    <tr>
                      <th className="th">Travel Request Id</th>
                      <th className="th">Name</th>
                      <th className="th">Travel Purpose</th>
                      <th className="th">Approver 1</th>
                      <th className="th">Approver 2</th>
                      <th className="th">Budget</th>
                      <th className="th">Status</th>
                      {(activeTab === 'draft' || activeTab === 'pendingAtApprover1 || pendingAtApprover2' || activeTab === 'all' ) && <th className="th">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length > 0 ? (
                      filteredData.map(item => (
                        <tr key={item.id}>
                        <td className="td-mylist">
                          <span
                            className="clickable-id"
                            onClick={() => handleRowClick(item)}
                          >
                            {item.travelRequestId || 'N/A'}
                          </span>
                        </td>
                          <td className="td-mylist">{`${item.firstName || 'N/A'} ${item.lastName || 'N/A'}`}</td>
                          <td className="td-mylist">{item.travelPurpose || 'N/A'}</td>
                          <td className="td-mylist">{item.manager || 'N/A'}</td>
                          <td className="td-mylist">{item.hod|| 'N/A'}</td>
                          <td className="td-mylist">{item.travelBudget || 'N/A'}</td>
                          <td className="td-mylist">{item.approveStatus?.name || 'N/A'}</td>
                          {/* <td className="td-mylist">{item.status?.label || 'N/A'}</td> */}
                          {/* {(activeTab === 'draft' || activeTab === 'pendingAtApprover1 || pendingAtApprover2')  && (
                            <td className="td-mylist">
                             <EditIcon
                                onClick={() => handleEditClick(item)}
                                style={{ cursor: 'pointer', marginRight: '10px' }}
                              />
                                <DeleteIcon
                                  onClick={() => handleDelete(item.id)}
                                  style={{ cursor: 'pointer'}}
                                />
                            </td>
                          )} */}
                            <td className="td-mylist">
                          {activeTab === 'pendingAtApprover1 || pendingAtApprover2' && item.approveStatus?.key === 'pendingAtApprover1' && (
            <EditIcon
              onClick={() => handleEditClick(item)}
              style={{ cursor: 'pointer' }}
            />
          )}
          {activeTab === 'draft' && (
            <>
              <EditIcon
                onClick={() => handleEditClick(item)}
                style={{ cursor: 'pointer', marginRight: '10px' }}
              />
              <DeleteIcon
                onClick={() => handleDelete(item.id)}
                style={{ cursor: 'pointer' }}
              />
              </>
          )}
            {activeTab === 'all' && item.approveStatus?.key === 'pendingAtApprover1' && (
            <EditIcon
              onClick={() => handleEditClick(item)}
              style={{ cursor: 'pointer' }}
            />
          )}
          {activeTab === 'all' && item.approveStatus?.key === 'draft' && (
            <>
              <EditIcon
                onClick={() => handleEditClick(item)}
                style={{ cursor: 'pointer', marginRight: '10px' }}
              />
              <DeleteIcon
                onClick={() => handleDelete(item.id)}
                style={{ cursor: 'pointer' }}
              />
              </>
          )}
          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="no-data">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div
                  className=
                  "pagination"><Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    shape="rounded"
                    variant="outlined" color="primary" /></div>
                <div style={{ marginTop: '10px', textAlign: 'left' }}>
                  Items per page:
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    style={{ marginLeft: '10px' }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyList;
