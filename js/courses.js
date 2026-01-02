// Courses Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    // University Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const universitySections = document.querySelectorAll('.university-section');
    const searchInput = document.getElementById('courseSearch');

    // Filter universities
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;

            // Show/hide university sections
            universitySections.forEach(section => {
                if (filter === 'all' || section.id === filter) {
                    section.style.display = 'block';
                    // Add animation
                    section.style.animation = 'fadeIn 0.5s ease';
                } else {
                    section.style.display = 'none';
                }
            });

            // Scroll to first visible section
            const firstVisible = document.querySelector('.university-section[style*="block"]');
            if (firstVisible && filter !== 'all') {
                firstVisible.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm.length < 2) {
                // Show all courses if search term is too short
                document.querySelectorAll('.course-card').forEach(card => {
                    card.style.display = 'block';
                });
                return;
            }

            // Search in course cards
            document.querySelectorAll('.course-card').forEach(card => {
                const courseName = card.querySelector('h3').textContent.toLowerCase();
                const courseDesc = card.querySelector('.course-desc').textContent.toLowerCase();
                const eligibility = card.querySelector('.eligibility p').textContent.toLowerCase();
                const careerOutcomes = card.querySelector('.career-outcomes p').textContent.toLowerCase();

                if (courseName.includes(searchTerm) || 
                    courseDesc.includes(searchTerm) ||
                    eligibility.includes(searchTerm) ||
                    careerOutcomes.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.animation = 'pulse 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });

            // Show/hide university sections based on visible courses
            universitySections.forEach(section => {
                const visibleCourses = section.querySelectorAll('.course-card[style*="block"]');
                if (visibleCourses.length > 0) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    }

    // Smooth scroll to university sections from filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            if (filter !== 'all') {
                const targetSection = document.getElementById(filter);
                if (targetSection) {
                    setTimeout(() => {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300);
                }
            }
        });
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.02);
            }
            100% {
                transform: scale(1);
            }
        }
        
        .course-card {
            animation: fadeIn 0.5s ease;
        }
    `;
    document.head.appendChild(style);

    // Course card hover effects
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        });
    });

    // Apply Now button tracking
    document.querySelectorAll('.course-card .btn-primary').forEach(button => {
        button.addEventListener('click', (e) => {
            const courseCard = e.target.closest('.course-card');
            const courseName = courseCard.querySelector('h3').textContent;
            const universitySection = courseCard.closest('.university-section');
            const universityName = universitySection.querySelector('h2').textContent;
            
            // Store course info in session storage for pre-filled application
            sessionStorage.setItem('selectedCourse', courseName);
            sessionStorage.setItem('selectedUniversity', universityName);
            
            // You can also send analytics data here
            console.log(`Course selected: ${courseName} at ${universityName}`);
        });
    });
});

// Course data for dynamic filtering (can be extended)
const courseData = {
    sanskriti: [
        {
            name: "B.Tech Computer Science",
            category: "Engineering",
            duration: "4 Years",
            seats: 120,
            eligibility: "10+2 with Physics, Chemistry, Maths (50% aggregate)"
        },
        {
            name: "MBA Digital Marketing",
            category: "Management",
            duration: "2 Years",
            seats: 60,
            eligibility: "Graduation in any discipline (50% aggregate)"
        }
    ],
    duke: [
        {
            name: "BBA International Business",
            category: "Management",
            duration: "3 Years",
            seats: 80,
            eligibility: "10+2 in any stream (45% aggregate)"
        },
        {
            name: "M.Sc Data Science",
            category: "Science",
            duration: "2 Years",
            seats: 40,
            eligibility: "B.Sc in Computer Science/Mathematics/Statistics"
        }
    ]
};

// Function to update course availability
function updateCourseAvailability(courseId, seatsAvailable) {
    // This function can be used to update course seats dynamically
    const courseElement = document.querySelector(`[data-course-id="${courseId}"]`);
    if (courseElement) {
        const seatElement = courseElement.querySelector('.course-details span:last-child');
        seatElement.textContent = `${seatsAvailable} Seats`;
        
        // Add low seat warning
        if (seatsAvailable < 10) {
            seatElement.style.color = '#ef4444';
            seatElement.style.fontWeight = 'bold';
        }
    }
}