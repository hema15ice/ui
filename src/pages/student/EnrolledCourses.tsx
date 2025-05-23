import { useState } from 'react';
import { Search, BookOpen, X, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Student } from '../../types';

const EnrolledCourses = () => {
  const navigate = useNavigate();
  const { courses, removeStudentFromCourse } = useDataContext();
  const { currentUser } = useAuth();
  const student = currentUser as Student;
  const [searchTerm, setSearchTerm] = useState('');

  // Get courses that the student is enrolled in
  const enrolledCourses = courses.filter(course => 
    student.courses.includes(course.id)
  );

  // Filter courses based on search term
  const filteredCourses = enrolledCourses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.faculty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDrop = (courseId: string) => {
    if (confirm('Are you sure you want to drop this course? This action cannot be undone.')) {
      removeStudentFromCourse(student.id, courseId);
    }
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/student/course/${courseId}`);
  };

  // Calculate attendance percentage for a course
  const calculateAttendance = (courseId: string) => {
    const courseAttendance = student.attendanceRecords.filter(record => record.courseId === courseId);
    if (courseAttendance.length === 0) return 0;
    
    const present = courseAttendance.filter(record => record.present).length;
    return Math.round((present / courseAttendance.length) * 100);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <p className="text-gray-600">View and manage your enrolled courses</p>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search your courses..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="p-6 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No courses match your search criteria.' : 'You are not enrolled in any courses yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredCourses.map((course) => {
              const attendancePercentage = calculateAttendance(course.id);
              
              return (
                <div 
                  key={course.id} 
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
                        <p className="text-sm text-gray-600">{course.code}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleDrop(course.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Drop Course"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {course.description || 'No description available.'}
                      </p>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          Attendance
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className={`h-2.5 rounded-full ${
                                attendancePercentage < 75 ? 'bg-red-600' : 'bg-green-600'
                              }`}
                              style={{ width: `${attendancePercentage}%` }}
                            ></div>
                          </div>
                          <span className={`text-xs font-medium ${
                            attendancePercentage < 75 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {attendancePercentage}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        Faculty: {course.faculty}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                        {course.department}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800">
                        Semester {course.semester}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                        {course.credits} Credits
                      </span>
                    </div>
                    
                    <button
                      onClick={() => handleViewCourse(course.id)}
                      className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Course Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;