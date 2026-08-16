import type { GetServerSideProps } from "next";

export default function AdminRedirect() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { notFound: true };
};
