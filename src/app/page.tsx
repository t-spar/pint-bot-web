export default function Home() {
  return (
    <div className="
      grid 
      grid-rows-[20px_1fr_20px] 
      items-center justify-items-center 
      min-h-screen p-8 pb-20 gap-16 sm:p-20"
    >
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl">Welcome to Pint Bot Web</h1>
        <p>Here you can view and manage your pint debts.</p>
      </main>
    </div>
  );
}
