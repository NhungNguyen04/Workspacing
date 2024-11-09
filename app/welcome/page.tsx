'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Clock, Users, Zap, ArrowRight, Star, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background text-foreground">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <img src="/logo.png" alt="WorkSpacing Logo" className="h-10" />
              <h1 className="ml-2 text-2xl font-bold text-primary">WorkSpacing</h1>
            </div>
            <nav className="hidden md:flex space-x-1">
              <Button variant="ghost">Features</Button>
              <Button variant="ghost">Pricing</Button>
              <Button variant="ghost">About</Button>
              <Button variant="ghost" asChild><Link href="/sign-in">Login</Link></Button>
              <Button variant="default" asChild><Link href="/sign-up">Get Started</Link></Button>
            </nav>
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon"><Menu className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Features</DropdownMenuItem>
                <DropdownMenuItem>Pricing</DropdownMenuItem>
                <DropdownMenuItem>About</DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/sign-in">Login</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/sign-up">Get Started</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient-x">
                Revolutionize Your Workflow
              </h2>
              <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
                Unlock unprecedented productivity with WorkSpacing's all-in-one collaboration platform.
              </p>
              <Button size="lg" asChild className="animate-bounce hover:animate-none text-lg">
                <Link href="/sign-up">Start Your Free Trial</Link>
              </Button>
            </div>
            <div className="md:w-1/2">
              <Image 
                src="/placeholder.svg?height=400&width=400" 
                alt="WorkSpacing Dashboard" 
                width={400} 
                height={400} 
                className="rounded-lg shadow-2xl animate-float"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" style={{ maskImage: 'radial-gradient(white, transparent)', WebkitMaskImage: 'radial-gradient(white, transparent)' }}></div>
        </section>

        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powerful Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Smart Time Management", description: "AI-powered scheduling and task prioritization.", icon: Clock, color: "text-blue-500" },
                { title: "Seamless Collaboration", description: "Real-time editing and communication tools.", icon: Users, color: "text-green-500" },
                { title: "Agile Workflow", description: "Customizable kanban boards and sprint planning.", icon: Zap, color: "text-yellow-500" },
              ].map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                  <CardContent className="p-6 text-center">
                    <feature.icon className={`w-16 h-16 mx-auto mb-4 ${feature.color} group-hover:scale-110 transition-all duration-300`} />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <Image 
                  src="/placeholder.svg?height=300&width=500" 
                  alt="WorkSpacing in action" 
                  width={500} 
                  height={300} 
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div>
                <ol className="space-y-6">
                  {[
                    "Sign up for a free account",
                    "Create your first project or team",
                    "Invite team members and assign roles",
                    "Start collaborating in real-time",
                  ].map((step, index) => (
                    <li key={index} className="flex items-center space-x-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="max-w-2xl mx-auto">
              {[
                { question: "Is WorkSpacing suitable for small teams?", answer: "WorkSpacing is designed to scale with your needs, whether you're a solo entrepreneur or part of a large enterprise." },
                { question: "Can I integrate WorkSpacing with other tools?", answer: "Yes, WorkSpacing offers seamless integration with popular tools like Slack, Google Drive, and many more to enhance your workflow." },
                { question: "Is my data secure with WorkSpacing?", answer: "We take data security seriously. WorkSpacing uses industry-standard encryption and regular security audits to keep your information safe." },
                { question: "What kind of support do you offer?", answer: "We provide 24/7 customer support via chat and email, as well as comprehensive documentation and video tutorials." },
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Workflow?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of satisfied users and experience the future of work management.</p>
            <form className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="bg-primary-foreground text-primary" />
              <Button type="submit" variant="secondary" className="w-full md:w-auto group">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            <p className="mt-4 text-sm text-primary-foreground/80">
              No credit card required. 14-day free trial.
            </p>
          </div>
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10"></div>
        </section>
      </main>

      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Roadmap</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground">© 2024 WorkSpacing. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}