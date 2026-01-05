// const columns = useMemo(
//     () => [
//       columnHelper.accessor('name', {
//         header: 'Name',
//         cell: (info) => info.getValue(),
//         size: 150,
//       }),
//       columnHelper.accessor('manufacturer', {
//         header: 'Manufacturer',
//         cell: (info) => info.getValue() || '-',
//         size: 120,
//       }),
//       columnHelper.accessor('version', {
//         header: 'Version',
//         cell: (info) => info.getValue() || '-',
//         size: 100,
//       }),
//       columnHelper.accessor('tebStatus', {
//         header: 'TEB Status',
//         cell: (info) => info.getValue() || '-',
//         size: 140,
//       }),
//       columnHelper.accessor('capability', {
//         header: 'Capability',
//         cell: (info) => info.getValue() || '-',
//         size: 140,
//       }),
//       columnHelper.accessor('subCapability', {
//         header: 'Sub-Capability',
//         cell: (info) => info.getValue() || '-',
//         size: 140,
//       }),
//       columnHelper.accessor('standardCategory', {
//         header: 'Standard Category',
//         cell: (info) => info.getValue() || '-',
//         size: 150,
//       }),
//       columnHelper.accessor('eaReferenceId', {
//         header: 'EA Reference ID',
//         cell: (info) => info.getValue() || '-',
//         size: 130,
//       }),
//       columnHelper.accessor('capabilityManager', {
//         header: 'Capability Manager',
//         cell: (info) => info.getValue() || '-',
//         size: 150,
//       }),
//       columnHelper.accessor('metaTags', {
//         header: 'Meta Tags',
//         cell: (info) => (
//           <div className={styles.metaTags}>
//             {info.getValue() || '-'}
//           </div>
//         ),
//         size: 200,
//       }),
//       columnHelper.accessor('standardsComments', {
//         header: 'Standards Comments',
//         cell: (info) => (
//           <div className={styles.description}>
//             {info.getValue() || '-'}
//           </div>
//         ),
//         size: 200,
//       }),
//       columnHelper.accessor('eaNotes', {
//         header: 'EA Notes',
//         cell: (info) => (
//           <div className={styles.description}>
//             {info.getValue() || '-'}
//           </div>
//         ),
//         size: 200,
//       }),
//       columnHelper.accessor('description', {
//         header: 'Description',
//         cell: (info) => (
//           <div className={styles.description}>
//             {info.getValue() || '-'}
//           </div>
//         ),
//         size: 250,
//       }),
//     ],
//     []
//   );
