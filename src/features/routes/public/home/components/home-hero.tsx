'use client';

import { Sparkles, Shield, Lock } from 'lucide-react';
import { Badge } from '@/components/core/badge';
import { Button } from '@/components/core/button';
import { Link } from '@/components/core/link';
import type { PublicHomeCopy } from '../types';

export function HomeHero({
  badges,
  hero,
}: {
  badges: PublicHomeCopy['badges'];
  hero: PublicHomeCopy['hero'];
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 shadow-sm sm:p-10 lg:p-12">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
          {badges.map((badge, idx) => (
            <Badge
              key={badge}
              variant={idx === 0 ? 'default' : 'secondary'}
              className="text-2xs font-semibold uppercase tracking-wider"
            >
              {badge}
            </Badge>
          ))}
        </div>

        <h1 className="font-mono text-3xl font-black uppercase tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {hero.title}
        </h1>

        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {hero.description}
        </p>

        {/* Highlighted Culture CTA Button */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="group relative w-full px-6 py-6 text-sm font-bold shadow-md transition-all hover:shadow-lg sm:w-auto sm:text-base"
          >
            <Link href="/culture">
              <Sparkles className="mr-2 h-5 w-5 animate-pulse text-tulpar-gold" />
              <span>{hero.cultureCta}</span>
            </Link>
          </Button>

          {/* Secondary Quick Entry Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/login">
                <Lock className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                {hero.loginAction}
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin">
                <Shield className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                {hero.adminAction}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
