import Container from "./Container";

export default function Footer() {
  return (
    <Container>
      <footer className="text-center p-6">
        <p className="text-sm text-slate-500 hover:text-white">
          copyright &copy; {new Date().getFullYear()} All Rights Reserved
        </p>
      </footer>
    </Container>
  );
}
