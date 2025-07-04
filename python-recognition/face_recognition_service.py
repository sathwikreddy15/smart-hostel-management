import face_recognition
import cv2
import numpy as np
import os
import json
import requests
from datetime import datetime
import time
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URI'))
db = client['hostel_management']

def load_known_faces():
    """Load known faces from the uploads directory"""
    known_faces = []
    known_names = []
    uploads_dir = '../backend/uploads'
    
    for filename in os.listdir(uploads_dir):
        if filename.endswith('.jpg'):
            # Roll number is the filename without extension
            roll_number = filename[:-4]
            image_path = os.path.join(uploads_dir, filename)
            
            # Load and encode face
            face_image = face_recognition.load_image_file(image_path)
            face_encoding = face_recognition.face_encodings(face_image)
            
            if face_encoding:
                known_faces.append(face_encoding[0])
                known_names.append(roll_number)
    
    return known_faces, known_names

def log_attendance(roll_number, confidence):
    """Log attendance in MongoDB"""
    try:
        # Get student details
        student = db.users.find_one({'rollNumber': roll_number})
        if not student:
            print(f"Student not found: {roll_number}")
            return
        
        current_time = datetime.now()
        current_date = current_time.date()
        
        # Check if attendance already exists for today
        existing_attendance = db.attendances.find_one({
            'student': student['_id'],
            'date': current_date
        })
        
        if existing_attendance:
            # Update exit time
            db.attendances.update_one(
                {'_id': existing_attendance['_id']},
                {'$set': {'timeOut': current_time}}
            )
        else:
            # Create new attendance record
            attendance = {
                'student': student['_id'],
                'date': current_date,
                'timeIn': current_time,
                'isPresent': True,
                'recognitionConfidence': confidence
            }
            db.attendances.insert_one(attendance)
        
        print(f"Attendance logged for {roll_number}")
        
    except Exception as e:
        print(f"Error logging attendance: {str(e)}")

def main():
    print("Loading known faces...")
    known_face_encodings, known_face_names = load_known_faces()
    
    print("Starting video capture...")
    video_capture = cv2.VideoCapture(0)
    
    while True:
        ret, frame = video_capture.read()
        if not ret:
            print("Failed to grab frame")
            break
            
        # Resize frame for faster processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = small_frame[:, :, ::-1]
        
        # Find faces in current frame
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)
        
        for face_encoding in face_encodings:
            # Compare with known faces
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.6)
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            
            if len(face_distances) > 0:
                best_match_index = np.argmin(face_distances)
                confidence = 1 - face_distances[best_match_index]
                
                if matches[best_match_index]:
                    name = known_face_names[best_match_index]
                    log_attendance(name, float(confidence))
                    
                    # Draw rectangle around face
                    top, right, bottom, left = face_locations[0]
                    top *= 4
                    right *= 4
                    bottom *= 4
                    left *= 4
                    
                    cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
                    cv2.putText(frame, f"{name} ({confidence:.2f})", 
                              (left, bottom + 20), 
                              cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 1)
        
        # Display the frame
        cv2.imshow('Facial Recognition', frame)
        
        # Break loop with 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    video_capture.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main() 