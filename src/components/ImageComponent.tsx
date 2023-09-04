import Image from 'next/image'
 
export default function ImageComponent() {
  return (
    <Image
      src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Vitejs-logo.svg"
      width={40}
      height={40}
      alt="logo"
    />
  )
}