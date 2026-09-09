import { stageInfo, type StageId } from '../../data'
import { Icon, type IconName } from '../ui/Icon'

type NavigationItem = {
  href: string
  icon: IconName
  label: string
  nestedOnly?: boolean
}

const navigationItems: NavigationItem[] = [
  { href: '#overview', icon: 'grid', label: 'Visão geral' },
  { href: '#comparison', icon: 'compare', label: 'Comparação' },
  { href: '#models', icon: 'models', label: 'Modelos' },
  { href: '#inference', icon: 'science', label: 'Inferência', nestedOnly: true },
  { href: '#methodology', icon: 'info', label: 'Metodologia' },
]

export function Sidebar({ stage }: { stage: StageId }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <Icon name="pulse" />
        </span>
        <span>
          <strong>CardioBench</strong>
          <small>Pesquisa clínica</small>
        </span>
      </div>

      <nav aria-label="Navegação principal">
        {navigationItems
          .filter((item) => !item.nestedOnly || stage === 'nested')
          .map((item, index) => (
            <a className={index === 0 ? 'active' : undefined} href={item.href} key={item.href}>
              <Icon name={item.icon} />
              {item.label}
            </a>
          ))}
      </nav>

      <div className="sidebar-note">
        <span>ETAPA ATIVA</span>
        <strong>
          <i /> {stageInfo[stage].short}
        </strong>
        <small>{stage === 'nested' ? '4 avaliações aninhadas' : '8 combinações exploratórias'}</small>
      </div>
    </aside>
  )
}
