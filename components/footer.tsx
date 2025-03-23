export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Store Finder. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a 
            href="#" 
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
          >
            Terms
          </a>
          <a 
            href="#" 
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
          >
            Privacy
          </a>
        </div>
      </div>
    </footer>
  )
}