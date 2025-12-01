import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-background pt-20 pb-20 md:pt-32 md:pb-32">
            <div className="container relative z-10 flex flex-col items-center text-center">
                <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-primary/10 text-primary mb-8">
                    <Sparkles className="h-4 w-4 mr-2 fill-primary" />
                    <span>Premium Printing Services</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 max-w-4xl">
                    Bring Your <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                        Vision to Life
                    </span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mb-10">
                    Experience the perfect blend of quality, speed, and creativity.
                    We transform your digital designs into stunning physical reality.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
                    <Link href="/services">
                        <Button size="lg" className="h-12 px-8 text-base rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all w-full sm:w-auto">
                            Start Printing <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full border-2 hover:bg-secondary/50 w-full sm:w-auto">
                            Get a Quote
                        </Button>
                    </Link>
                </div>

                <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>24h Turnaround</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Eco-friendly</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span>Satisfaction Guarantee</span>
                    </div>
                </div>

                {/* Abstract Background Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 pointer-events-none -z-10">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-500 rounded-full blur-3xl animate-pulse" />
                </div>
            </div>
        </section>
    );
}
