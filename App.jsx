import React, { useMemo, useState } from 'react'
import { AREAS, LISTINGS } from './data'

function MapLink({lat,lng,name}){
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}%20${lat},${lng}`
  return <a className='maplink' href={url} target='_blank' rel='noreferrer'>Open in Google Maps</a>
}

function Card({item}){
  return (
    <div className='card'>
      <h3>{item.name}</h3>
      <div className='small'>{item.area}</div>
      <div className='small'>{item.address}</div>
      <div style={{marginTop:8}}><MapLink lat={item.lat} lng={item.lng} name={item.name} /></div>
    </div>
  )
}

export default function App(){
  const [query, setQuery] = useState('')
  const [area, setArea] = useState('All')
  const listings = LISTINGS

  const filtered = useMemo(()=>{
    const q = (query||'').trim().toLowerCase()
    return listings.filter(l=>{
      if(area !== 'All' && l.area.toLowerCase() !== area.toLowerCase()) return false
      if(!q) return true
      const hay = `${l.name} ${l.area} ${l.address}`.toLowerCase()
      return hay.includes(q)
    })
  },[listings, query, area])

  return (
    <div>
      <header className='header'>
        <div className='logo'>
          <div className='mark'>LW</div>
          <div>
            <div style={{fontWeight:700}}>LocalWorship.ie</div>
            <div style={{fontSize:12,color:'#6b7280'}}>Places of worship • Dublin</div>
          </div>
        </div>
      </header>

      <main className='container'>
        <section className='hero'>
          <div className='left'>
            <h1 className='title'>Find a place of peace and prayer near you</h1>
            <p className='lead'>Discover churches, mosques, temples, synagogues, and more across Dublin.</p>

            <div className='controls'>
              <input className='input' value={query} onChange={e=>setQuery(e.target.value)} placeholder='Search by name, faith or address...' />
              <select className='select' value={area} onChange={e=>setArea(e.target.value)}>
                <option>All</option>
                {AREAS.map(a=> <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className='filters-bar'>
              <div style={{color:'#6b7280'}}>{(area!=='All' || query) ? <>Filtering by: <strong>{[area, query].filter(Boolean).join(', ')}</strong></> : 'Showing all listings'}</div>
              <div style={{fontSize:12,color:'#9ca3af'}}>{filtered.length} result{filtered.length!==1?'s':''}</div>
            </div>

            <div className='grid' style={{marginTop:12}}>
              {filtered.map(i=> <Card key={i.id} item={i} />)}
              {filtered.length===0 && <div style={{color:'#6b7280'}}>No matching results.</div>}
            </div>
          </div>

          <aside style={{width:420}}>
            <div className='card' style={{height:420}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:8}}>Map</div>
              <div style={{color:'#6b7280',fontSize:13}}>Map preview disabled in this build. Use the result's 'Open in Google Maps' link.</div>
            </div>
          </aside>
        </section>

        <footer className='footer'>© {new Date().getFullYear()} LocalWorship.ie — All faiths, one community.</footer>
      </main>
    </div>
  )
}
