import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-canvas-mist text-ink-black flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-24 pb-20">
        <div className="shop-container">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 mb-8 animate-pulse">
            <div className="h-3 w-14 bg-pure-white rounded-full"></div>
            <span className="text-muted-gray/40">/</span>
            <div className="h-3 w-16 bg-pure-white rounded-full"></div>
            <span className="text-muted-gray/40">/</span>
            <div className="h-3 w-28 bg-pure-white rounded-full"></div>
          </div>

          {/* 2-Column Product Detail Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Visual Card Skeleton */}
            <div className="lg:col-span-5 space-y-6">
              {/* Main Image Box Skeleton */}
              <div className="bg-pure-white rounded-cards shadow-sm-2 p-4 border border-faint-border animate-pulse">
                <div
                  className="relative w-full aspect-square bg-[#f5f6f7] flex items-center justify-center p-8 overflow-hidden"
                  style={{ borderRadius: '20px' }}
                >
                  <div className="w-24 h-24 rounded-2xl bg-canvas-mist/80"></div>

                  {/* Stock Pill Top Right */}
                  <div className="absolute top-3.5 right-3.5 w-20 h-6 rounded-full bg-pure-white shadow-sm"></div>
                  {/* Category Pill Top Left */}
                  <div className="absolute top-3.5 left-3.5 w-20 h-6 rounded-full bg-pure-white shadow-sm"></div>
                </div>
              </div>

              {/* Assurance Strip Skeleton */}
              <div className="bg-pure-white rounded-cards p-5 shadow-sm-2 border border-faint-border space-y-3.5 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-canvas-mist"></div>
                  <div className="space-y-1 flex-1">
                    <div className="h-3.5 w-1/3 bg-canvas-mist rounded"></div>
                    <div className="h-2.5 w-1/2 bg-canvas-mist rounded"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-canvas-mist"></div>
                  <div className="space-y-1 flex-1">
                    <div className="h-3.5 w-1/4 bg-canvas-mist rounded"></div>
                    <div className="h-2.5 w-2/3 bg-canvas-mist rounded"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Purchasing Panel Skeleton */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-pure-white rounded-cards p-6 sm:p-8 shadow-sm-2 border border-faint-border space-y-6 animate-pulse">
                {/* Title & Badge Skeleton */}
                <div className="space-y-3">
                  <div className="w-24 h-5 rounded-full bg-canvas-mist"></div>
                  <div className="w-4/5 h-8 rounded-xl bg-canvas-mist"></div>
                  <div className="w-2/3 h-4 rounded-lg bg-canvas-mist"></div>
                </div>

                {/* Price Bar Skeleton */}
                <div className="p-4 rounded-2xl bg-[#fafafa] border border-faint-border flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="w-12 h-2.5 rounded bg-canvas-mist"></div>
                    <div className="w-36 h-8 rounded-lg bg-canvas-mist"></div>
                  </div>
                  <div className="w-24 h-8 rounded-full bg-canvas-mist"></div>
                </div>

                {/* Variant Options Skeleton */}
                <div className="space-y-3 pt-2">
                  <div className="w-32 h-3.5 rounded bg-canvas-mist"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="h-20 rounded-2xl border border-faint-border bg-canvas-mist/40 p-3"></div>
                    <div className="h-20 rounded-2xl border border-faint-border bg-canvas-mist/40 p-3"></div>
                  </div>
                </div>

                {/* Action Button Skeleton */}
                <div className="pt-4">
                  <div className="w-full h-14 rounded-full bg-shop-violet/25 shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
