// Complaints Page
import React, { useState, useEffect, useContext } from 'react';
import { FiImage, FiMapPin } from 'react-icons/fi';
import AuthContext from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { createComplaint, getUserComplaints, getAllComplaints, takeComplaint, completeComplaint } from '../services/complaintService';
import './Complaints.css';
import { toast } from 'react-toastify';

function Complaints() {
  const { user } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'garbage_overflow',
    waste_dumped: 'dumped',
    material_type: 'biodegradable',
    image: null
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      if (user?.role === 'citizen') {
        const response = await getUserComplaints();
        setComplaints(response.data.complaints);
      } else if (user?.role === 'admin' || user?.role === 'worker') {
        const response = await getAllComplaints();
        setComplaints(response.data.complaints);
      }
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('category', formData.category);
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }
      formDataObj.append('waste_dumped', formData.waste_dumped);
      formDataObj.append('material_type', formData.material_type);

      await createComplaint(formDataObj);
      toast.success('Complaint filed successfully');
      setShowForm(false);
      setFormData({ title: '', description: '', category: 'garbage_overflow', waste_dumped: 'dumped', material_type: 'biodegradable', image: null });
      fetchComplaints();
    } catch (error) {
      toast.error('Failed to file complaint');
    }
  };

  const handleTake = async (complaintId) => {
    try {
      await takeComplaint(complaintId);
      toast.success('Complaint taken. Get out there and clear it!');
      fetchComplaints();
    } catch (error) {
      toast.error(error.message || 'Failed to take complaint');
    }
  };

  const handleComplete = async (complaintId) => {
    try {
      await completeComplaint(complaintId);
      toast.success('Complaint marked as completed');
      fetchComplaints();
    } catch (error) {
      toast.error(error.message || 'Failed to mark complaint as completed');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'blue';
      case 'in_progress':
        return 'orange';
      case 'resolved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div className="complaints">
      <div className="page-header">
        <h1>Complaints Management</h1>
        <p>Report and track waste management issues</p>
      </div>

      {user?.role === 'citizen' && (
        <button 
          className="btn-create" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ File New Complaint'}
        </button>
      )}

      {showForm && user?.role === 'citizen' && (
        <div className="complaint-form-card">
          <h2>File a New Complaint</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Brief title of the issue"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                placeholder="Detailed description of the issue"
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="garbage_overflow">Garbage Overflow</option>
                <option value="bin_damage">Bin Damage</option>
                <option value="collection_delay">Collection Delay</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="waste_dumped">Waste Dumped</label>
              <select
                id="waste_dumped"
                value={formData.waste_dumped}
                onChange={(e) => setFormData(prev => ({ ...prev, waste_dumped: e.target.value }))}
              >
                <option value="dumped">Dumped</option>
                <option value="not_dumped">Not Dumped</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="material_type">Material Type</label>
              <select
                id="material_type"
                value={formData.material_type}
                onChange={(e) => setFormData(prev => ({ ...prev, material_type: e.target.value }))}
              >
                <option value="biodegradable">Biodegradable</option>
                <option value="non_biodegradable">Non Biodegradable</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="image">Upload Image</label>
              <div className="file-input-wrapper">
                <FiImage />
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <span>{formData.image?.name || 'Click to select image'}</span>
              </div>
            </div>

            <button type="submit" className="btn-submit">Submit Complaint</button>
          </form>
        </div>
      )}

      <div className="complaints-grid">
        {complaints.length === 0 ? (
          <p className="no-data">No complaints found</p>
        ) : (
          complaints.map(complaint => (
            <div key={complaint.id} className={`complaint-card status-${complaint.status}`}>
              <div className="complaint-header">
                <h3>{complaint.title}</h3>
                <span className={`status-badge ${complaint.status}`}>
                  {complaint.status.replace('_', ' ')}
                </span>
              </div>

              <p className="complaint-description">{complaint.description}</p>

              {complaint.image_url && (
                <div className="complaint-image">
                  <img src={complaint.image_url} alt="Complaint" />
                </div>
              )}

              <div className="complaint-meta">
                <span className="category">{complaint.category.replace('_', ' ')}</span>
                <span className="priority">{complaint.priority}</span>
                <span className="waste-info">{complaint.waste_dumped === 'dumped' ? 'Waste Dumped' : 'Not Dumped'}</span>
                <span className="waste-info">{complaint.material_type === 'biodegradable' ? 'Biodegradable' : 'Non Biodegradable'}</span>
              </div>

              <div className="complaint-footer">
                <small>Filed: {new Date(complaint.created_at).toLocaleDateString()}</small>
              </div>

              {user?.role === 'worker' && complaint.status === 'pending' && (
                <div className="complaint-actions">
                  <button className="btn-take" onClick={() => handleTake(complaint.id)}>
                    Take Complaint
                  </button>
                </div>
              )}

              {user?.role === 'worker' && complaint.status === 'in_progress' && complaint.worker_id === user.id && (
                <div className="complaint-actions">
                  <button className="btn-complete" onClick={() => handleComplete(complaint.id)}>
                    Mark as Completed
                  </button>
                </div>
              )}

              {user?.role === 'worker' && complaint.status === 'in_progress' && complaint.worker_id !== user.id && (
                <div className="complaint-actions">
                  <small className="taken-note">Already taken by another worker</small>
                </div>
              )}

              {complaint.status === 'resolved' && (
                <div className="resolution-notes">
                  <p><strong>Resolution:</strong> {complaint.resolution_notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Complaints;