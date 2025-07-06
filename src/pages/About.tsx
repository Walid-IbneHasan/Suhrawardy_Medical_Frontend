
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Users, Heart, Activity, Shield, Clock } from 'lucide-react';

const About = () => {
  const achievements = [
    {
      icon: Award,
      title: "Excellence Award 2023",
      description: "Recognized for outstanding healthcare services and patient satisfaction"
    },
    {
      icon: Users,
      title: "Expert Medical Team",
      description: "Board-certified specialists with decades of combined experience"
    },
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Patient-centered approach with personalized treatment plans"
    },
    {
      icon: Activity,
      title: "Advanced Technology",
      description: "State-of-the-art medical equipment and modern facilities"
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Highest safety standards and infection control protocols"
    },
    {
      icon: Clock,
      title: "24/7 Emergency Care",
      description: "Round-the-clock emergency services for critical situations"
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      specialty: "Internal Medicine",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Dr. Michael Chen",
      role: "Head of Cardiology",
      specialty: "Cardiovascular Medicine",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Emergency Department Director",
      specialty: "Emergency Medicine",
      image: "https://images.unsplash.com/photo-1594824475518-f5ffe36e8b3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About MediCare Plus
              </h1>
              <div className="w-24 h-1 medical-gradient rounded-full mb-8"></div>
              
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                For over 25 years, MediCare Plus has been at the forefront of providing exceptional 
                healthcare services to our community. We combine cutting-edge medical technology 
                with compassionate care to ensure the best possible outcomes for our patients.
              </p>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our mission is to provide accessible, high-quality healthcare services that improve 
                the health and well-being of our community while maintaining the highest standards 
                of medical excellence and compassionate care.
              </p>

              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                  <div className="text-sm text-gray-600">Patients Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>

            <div className="animate-slide-in-left">
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Medical team"
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values & Achievements */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values & Achievements</h2>
            <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are committed to excellence in everything we do, from patient care to community service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} className="medical-card-hover border-0 shadow-lg text-center h-full">
                  <CardHeader className="pb-4">
                    <div className="medical-gradient w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">
                      {achievement.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {achievement.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <div className="w-24 h-1 medical-gradient mx-auto rounded-full mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the experienced medical professionals who lead our commitment to exceptional healthcare.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="medical-card-hover border-0 shadow-lg text-center overflow-hidden">
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-gray-900">{member.name}</CardTitle>
                  <CardDescription className="text-blue-600 font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.specialty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              "To provide accessible, high-quality healthcare services that improve the health 
              and well-being of our community while maintaining the highest standards of medical 
              excellence and compassionate care."
            </p>
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h4>
              <div className="grid md:grid-cols-3 gap-4 text-gray-600">
                <div>
                  <strong>Phone:</strong><br />
                  +1 (555) 123-4567
                </div>
                <div>
                  <strong>Email:</strong><br />
                  info@medicareplus.com
                </div>
                <div>
                  <strong>Address:</strong><br />
                  123 Healthcare Ave<br />
                  Medical City
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
