import Image from 'next/image'
import logo from 'src/assets/logo-hct-original.svg'

export default function Logo() {
  return <Image src={logo} alt="HCT Logo" width={100} height={100} />
}
