
import { useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ClipboardCheck, Clock, Shield, SearchCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import PageTransition from "@/components/layout/PageTransition";

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/70 backdrop-blur-sm border border-border/50 h-full">
        <CardHeader>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
            {icon}
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base text-balance">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const HeroSection = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section className="hero-section">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 to-white" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="h-full w-full">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="absolute bg-blue-100/50 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 300 + 50}px`,
                  height: `${Math.random() * 300 + 50}px`,
                  opacity: Math.random() * 0.3 + 0.1,
                  filter: 'blur(50px)',
                  transform: `scale(${Math.random() * 1 + 0.5})`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          style={{ y, opacity }}
          className="max-w-4xl mx-auto text-center pt-10 md:pt-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="tag-pill bg-primary/10 text-primary mb-4">Streamline Your Operations</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-balance"
          >
            Digital Work Logbook for Modern Industries
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-balance"
          >
            Replace manual logs with a seamless digital experience. Track operations, ensure compliance, and make data-driven decisions with our intuitive platform.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="button-hover-effect px-6 py-6">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link to="/login">
              <Button variant="outline" size="lg" className="button-hover-effect px-6 py-6">
                Log In
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 md:mt-24 relative"
        >
          <div className="subtle-shadow glass-panel rounded-2xl overflow-hidden border border-white/40">
            <div className="absolute inset-0 backdrop-blur-md bg-white/50 z-[-1]" />
            <img 
              src="https://placehold.co/1200x600/e4f1fe/ffffff?text=Dashboard+Preview" 
              alt="Dashboard Preview" 
              className="w-full h-auto object-cover rounded-xl shadow-inner"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <ClipboardCheck className="h-6 w-6" />,
      title: "Real-time Log Entry",
      description: "Record operational data instantly with smart forms that guide users through the entry process, reducing errors and improving data quality."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Shift Management",
      description: "Seamlessly track and manage activities across different shifts, ensuring continuity and accountability throughout the day."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Compliance Assurance",
      description: "Meet regulatory requirements with built-in verification workflows and audit trails that document all operational activities."
    },
    {
      icon: <SearchCheck className="h-6 w-6" />,
      title: "Advanced Search & Analytics",
      description: "Quickly find historical data and generate insights with powerful search capabilities and visualization tools."
    }
  ];

  return (
    <section className="page-section bg-white">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Designed for Operational Excellence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Our logbook system transforms how industrial teams document, manage, and utilize operational data.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const RolesSection = () => {
  const roles = [
    {
      title: "Shift Engineers",
      description: "Easily document operations, equipment status, and incidents through intuitive digital forms.",
      cta: "View Engineer Dashboard",
      link: "/engineer"
    },
    {
      title: "Plant Supervisors",
      description: "Review logs, approve entries, and monitor performance metrics across all shifts.",
      cta: "View Supervisor Dashboard",
      link: "/supervisor"
    },
    {
      title: "Compliance Teams",
      description: "Access comprehensive records for audits, generate reports, and ensure regulatory compliance.",
      cta: "View Compliance Dashboard",
      link: "/compliance"
    }
  ];

  return (
    <section className="page-section bg-blue-50">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Tailored for Every Team Member
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Different roles require different tools. Our platform provides customized experiences for each user type.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden subtle-shadow"
            >
              <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">{index + 1}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{role.title}</h3>
                <p className="text-muted-foreground mb-6">{role.description}</p>
                <Link to={role.link}>
                  <Button variant="outline" className="w-full button-hover-effect">
                    {role.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="page-section">
      <div className="container max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="bg-primary rounded-2xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-blue-600 opacity-20 z-0">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="absolute bg-white/20 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 400 + 100}px`,
                  height: `${Math.random() * 400 + 100}px`,
                  opacity: Math.random() * 0.3,
                  filter: 'blur(70px)',
                }}
              />
            ))}
          </div>
          <div className="py-16 px-8 md:px-12 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your Operations?</h2>
              <p className="text-xl text-white/80 mb-8">
                Join forward-thinking organizations that have already improved efficiency and compliance with our digital logbook solution.
              </p>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="button-hover-effect px-6 py-6">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FooterSection = () => {
  return (
    <footer className="bg-secondary py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-display font-bold text-white mb-4">LogBook</div>
            <p className="text-white/70 mb-6">
              A modern solution for industrial record-keeping and operational excellence.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/login" className="text-white/70 hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/engineer" className="text-white/70 hover:text-white transition-colors">Engineer Dashboard</Link></li>
              <li><Link to="/supervisor" className="text-white/70 hover:text-white transition-colors">Supervisor Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-white/70">support@logbook.com</li>
              <li className="text-white/70">+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-6 text-white/50 text-sm text-center">
          &copy; {new Date().getFullYear()} LogBook. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const Index = () => {
  return (
    <PageTransition>
      <HeroSection />
      <FeaturesSection />
      <RolesSection />
      <CTASection />
      <FooterSection />
    </PageTransition>
  );
};

export default Index;
