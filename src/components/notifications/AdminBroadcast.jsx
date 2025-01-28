import React, { useState } from 'react';
import { notificationApi } from '../../api/notificationApi';

const AdminBroadcast = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        
        try {
            await notificationApi.sendBroadcast({ title, description });
            setTitle('');
            setDescription('');
            showToast('Broadcast sent successfully', 'success');
        } catch (error) {
            showToast('Failed to send broadcast', 'error');
        } finally {
            setSending(false);
        }
    };

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
        }, 3000);
    };

    return (
        <div className="admin-broadcast-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-input"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="description">Message</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-textarea"
                        rows="4"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={sending}
                >
                    {sending ? 'Sending...' : 'Send Broadcast'}
                </button>
            </form>

            {toast?.show && (
                <div className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default AdminBroadcast;