import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductsTable } from "./components/InfiniteTable";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductsTable />
    </QueryClientProvider>
  );
}

export default App;
