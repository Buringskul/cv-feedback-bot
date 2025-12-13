export default function LoadingScreen() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
        <p className="mt-4 text-lg text-muted-foreground">Analyzing your CV...</p>
      </div>
    );
  }
  