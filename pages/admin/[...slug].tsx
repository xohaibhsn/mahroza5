export async function getServerSideProps() {
  return { notFound: true };
}

/** Old /admin/* URLs — intentionally 404 for security */
export default function LegacyAdminCatchAll() {
  return null;
}
