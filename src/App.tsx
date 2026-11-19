export interface AppProps {
  title?: string;
}

export function App({ title = 'project-a-fe' }: AppProps) {
  return (
    <main>
      <h1>{title}</h1>
    </main>
  );
}
