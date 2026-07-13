export interface Project {
  name: string
  blurb: string
  url?: string
  tag: string
}

export const projects: Project[] = [
  { name: 'Enta', blurb: 'One marketplace, everything real estate.', tag: 'AHGLAB' },
  { name: 'Collo PH', blurb: 'Manage your properties the easiest way.', url: 'https://collo.ph/', tag: 'AHGLAB' },
  { name: 'Doon PH', blurb: 'Rent a car and enjoy the journey.', url: 'https://doon.ph/', tag: 'AHGLAB' },
  { name: 'SagiPinas', blurb: 'A disaster-risk response platform for a safer country.', url: 'https://sagipinas.nplixel.now.sh/', tag: 'HAngathon 2019' },
  { name: 'Zing at Ayala Malls', blurb: 'Discovery platform for shoppers at Ayala Malls.', url: 'https://www.ayalamalls.com/', tag: 'White Cloak' },
  { name: 'Airship Riders', blurb: 'Real-time package handoffs from hub to rider to client.', url: 'https://www.airship.me/', tag: 'Airship' },
  { name: 'Petpal', blurb: 'A social community for pet lovers.', tag: 'White Cloak' },
  { name: 'Project Tempo', blurb: 'A simple, elegant time logger.', tag: 'WC Hack 2019' },
  { name: 'GetGo Pay', blurb: 'A prepaid mobile banking app with rewards.', tag: 'White Cloak' },
]
