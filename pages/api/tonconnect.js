// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default function handler(
  req,
  res
) {
  return res.status(200).json({
    "url": "http://localhost:3000/magic",
    "name": "TON Vote",
    "iconUrl": "https://ton.vote/logo.png"
})
}
  
  
  