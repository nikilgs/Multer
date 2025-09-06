import React, { useEffect, useState } from "react";


export default function Profile() {
  const [fileInput, setFileInput] = useState(null);
  const [selectedImageForDisplay, setSelectedImageForDisplay] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    const savedImageURL = localStorage.getItem("selectedImageForDisplay");
    if (savedImageURL) {
      setSelectedImageForDisplay(savedImageURL);
    }
  }, []);

  const onChangeHandle = (e) => {
    const file = e.target.files[0];
    setFileInput(file);
    
    // Create a preview of the selected image
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setSelectedImageForDisplay(objectUrl);
      setUploadStatus("");
    }
  };

  const handleImageUpload = async () => {
    if (!fileInput) {
      setUploadStatus("Please select an image first");
      return;
    }

    setIsUploading(true);
    setUploadStatus("Uploading...");

    const formData = new FormData();
    formData.append("image", fileInput);

    try {
      const response = await fetch("http://localhost:5000/api/images/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setUploadStatus("Upload successful!");
      
      // Store the image URL in localStorage for persistence
      const imageUrl = `http://localhost:5000/api/images/${data.id}`;
      localStorage.setItem("selectedImageForDisplay", imageUrl);
      
    } catch (err) {
      console.error("Error uploading image:", err);
      setUploadStatus("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setSelectedImageForDisplay(null);
    setFileInput(null);
    localStorage.removeItem("selectedImageForDisplay");
    setUploadStatus("");
  };

  return (
    <div className="profile-container">
      <h2 className="profile-title">Profile Picture</h2>
      <p className="profile-subtitle">Upload a profile picture to personalize your account</p>
      
      <div className="upload-section">
        <div className="image-preview">
          {selectedImageForDisplay ? (
            <div className="preview-container">
              <img
                src={selectedImageForDisplay}
                alt="Profile Preview"
                className="profile-image"
              />
              <button className="remove-btn" onClick={removeImage}>
                ×
              </button>
            </div>
          ) : (
            <div className="placeholder">
              <div className="placeholder-icon">📷</div>
              <p>No image selected</p>
            </div>
          )}
        </div>
        
        <div className="upload-controls">
          <label htmlFor="file-upload" className="file-label">
            Choose Image
          </label>
          <input 
            id="file-upload"
            type="file" 
            accept="image/*" 
            onChange={onChangeHandle}
            className="file-input"
          />
          
          <button
            onClick={handleImageUpload}
            disabled={isUploading || !fileInput}
            className={`upload-btn ${isUploading ? 'loading' : ''}`}
          >
            {isUploading ? (
              <>
                <span className="spinner"></span>
                Uploading...
              </>
            ) : (
              'Upload Image'
            )}
          </button>
          
          {uploadStatus && (
            <div className={`status ${uploadStatus.includes("success") ? "success" : "error"}`}>
              {uploadStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}