export async function getServerSideProps() {
  return { notFound: true };
}

/** Old /admin URL — intentionally 404 for security */
export default function LegacyAdminIndex() {
  return null;
}
