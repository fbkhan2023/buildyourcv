import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { FileText, Sparkles, Palette, Printer, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Easy to Use',
    description: 'Simple step-by-step process to build your resume in minutes',
  },
  {
    icon: Palette,
    title: 'Multiple Templates',
    description: 'Choose from modern, classic, or minimal designs',
  },
  {
    icon: Printer,
    title: 'Print Ready',
    description: 'Export and print your resume with one click',
  },
  {
    icon: Shield,
    title: 'Save & Edit',
    description: 'Your resumes are saved securely for future editing',
  },
  {
    icon: Zap,
    title: 'Live Preview',
    description: 'See changes in real-time as you build',
  },
  {
    icon: FileText,
    title: 'Professional Format',
    description: 'Industry-standard formatting that recruiters love',
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleGetStarted = () => {
    navigate('/builder');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-subtle" />
        <div className="container relative py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Build Your Perfect Resume{' '}
              <span className="text-gradient">in Minutes</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create a professional, ATS-friendly resume with our easy-to-use builder. 
              Choose from multiple templates and export instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="gradient-primary text-lg px-8 py-6 shadow-glow hover:shadow-elevated transition-all duration-300"
              >
                <FileText className="mr-2 h-5 w-5" />
                Start Building for Free
              </Button>
              {user && (
                <Link to="/my-resumes">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                    View My Resumes
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Everything You Need to Stand Out
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our resume builder provides all the tools you need to create a compelling resume
              that gets you noticed by employers.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-background rounded-xl p-6 shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="gradient-primary rounded-lg p-3 w-fit mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="gradient-primary rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Create Your Resume?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of job seekers who have landed their dream jobs with our resume builder.
              It's free to start!
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-muted-foreground">
          <p>© 2024 ResumeBuilder. Build your future today.</p>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;
