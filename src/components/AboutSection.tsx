
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Award, Users, Heart, Activity } from 'lucide-react';

const AboutSection = () => {
  const achievements = [
    {
      icon: Award,
      title: "Excellence Award",
      description: "Recognized for outstanding healthcare services"
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Board-certified specialists and caring staff"
    },
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "Patient-centered approach to healthcare"
    },
    {
      icon: Activity,
      title: "Advanced Technology",
      description: "State-of-the-art medical equipment and facilities"
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About MediCare Plus
            </h2>
            <div className="w-24 h-1 medical-gradient rounded-full mb-8"></div>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              For over 25 years, MediCare Plus has been at the forefront of providing exceptional 
              healthcare services to our community. We combine cutting-edge medical technology 
              with compassionate care to ensure the best possible outcomes for our patients.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Our team of board-certified physicians, nurses, and healthcare professionals is 
              dedicated to delivering personalized care that meets the unique needs of every 
              patient we serve.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/about">
                <Button size="lg" className="medical-gradient text-white hover:opacity-90 px-8 py-3">
                  Learn More About Us
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 px-8 py-3">
                  Our Services
                </Button>
              </Link>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-2 gap-6 animate-slide-in-left">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <Card key={index} className="medical-card-hover border-0 shadow-lg text-center p-6">
                  <CardContent className="p-0">
                    <div className="medical-gradient w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mt-20 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Our Mission</h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              "To provide accessible, high-quality healthcare services that improve the health 
              and well-being of our community while maintaining the highest standards of medical 
              excellence and compassionate care."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
