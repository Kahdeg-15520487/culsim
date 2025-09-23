# Copilot Instructions for CULSIM

## Game Overview
CULSIM is a Chinese cultivation mythology-inspired incremental game with roguelike elements. Players start as mortal souls with no cultivation talent and progress through multiple lifetimes, carrying over benefits from life events and cultivation achievements.

## Core Architecture

### Game Loop Structure
- **Time Progression** (Tiến Độ Thời Gian): Game time advances continuously regardless of player actions
- **Life Cycles** (Chu Kỳ Đời Sống): Each life has a natural lifespan (100-200 years) with death triggers: natural end, combat death, or voluntary reincarnation
- **Reincarnation System** (Hệ Thống Tái Sinh): Soul enters rebirth cycle, retaining cultivation insights, artifacts, and karmic benefits

### Key Components
- **CultivationSystem** (Hệ Thống Tu Luyện): Manages qi absorption, meridian breakthroughs, realm progression
- **ElementSystem** (Hệ Thống Ngũ Hành): Five elements (Metal/Kim 金, Wood/Mộc 木, Water/Thủy 水, Fire/Hỏa 火, Earth/Thổ 土) with cyclical buff/debuff relationships
- **CombatSystem** (Hệ Thống Chiến Đấu): Deterministic melee + probabilistic ranged combat with elemental interactions
- **EventSystem** (Hệ Thống Sự Kiện): Life events that permanently enhance cultivation potential
- **ArtifactSystem** (Hệ Thống Pháp Bảo): Craftable items that persist through reincarnations
- **AlchemySystem** (Hệ Thống Đan Đạo): Pill creation for temporary boosts and permanent cultivation aids

## Cultivation Mechanics

### Realm Progression (Tiến Bộ Cảnh Giới)
```typescript
enum CultivationRealm {
  Mortal = 0,              // Phàm Nhân (Mortal)
  QiCondensation = 1,      // Luyện Khí (Qi Condensation)
  FoundationEstablishment = 2, // Trúc Cơ (Foundation Establishment)
  CoreFormation = 3,       // Kim Đan (Core Formation)
  NascentSoul = 4,         // Nguyên Anh (Nascent Soul)
  DivineTransformation = 5, // Hóa Thần (Divine Transformation)
  VoidRefinement = 6,      // Luyện Không (Void Refinement)
  ImmortalAscension = 7    // Phi Thăng (Immortal Ascension)
}
```

#### Mortal Realm (Phàm Nhân Cảnh - Foundation Building)
**Description**: The starting point for all cultivators. Mortals have no spiritual awareness and must awaken their potential through meditation and qi sensing.

**Element Complementarity** (Ngũ Hành Bổ Sung): Each mortal soul is born with a primary elemental affinity (Wood/Mộc 木, Metal/Kim 金, Water/Thủy 水, Fire/Hỏa 火, or Earth/Thổ 土) that serves as their cultivation foundation.

**Advancement Criteria** (Tiêu Chí Tiến Bộ):
- Accumulate 100 units of spiritual qi (tích lũy 100 đơn vị linh khí)
- Successfully sense and absorb ambient qi for 7 consecutive days (cảm nhận và hấp thụ linh khí trong 7 ngày liên tiếp)
- Complete basic meditation ritual (hoàn thành nghi thức thiền định cơ bản)

**Quality Criteria** (Tiêu Chí Chất Lượng):
- **Elements** (Ngũ Hành): Primary element affinity must be awakened (Wood/Mộc 木, Metal/Kim 金, Water/Thủy 水, Fire/Hỏa 火, or Earth/Thổ 土)
- **Artifacts** (Pháp Bảo): Spirit Stone pendant (Thiên Linh Thạch - increases qi absorption rate by 20%)
- **Alchemy Pills** (Đan Dược): Awakening Pill (Tỉnh Ngộ Đan - removes spiritual blockages)
- **Rituals** (Nghi Thức): Dawn Meditation Ceremony (Thần Hào Thiền Pháp - performed at sunrise for 49 days)

#### Qi Condensation Realm (Luyện Khí Cảnh - Energy Gathering)
**Description**: Cultivators learn to condense ambient qi into their dantian, forming a foundation for higher realms. This realm focuses on purification and storage of qi.

**Element Complementarity** (Ngũ Hành Bổ Sung): Begin cultivating the primary elemental affinity. Focus on strengthening the birth element while learning basic elemental manipulation.

**Advancement Criteria** (Tiêu Chí Tiến Bộ):
- Condense 1,000 units of qi into dantian (ngưng tụ 1,000 đơn vị khí vào đan điền)
- Open and purify 12 major meridians (mở và tinh lọc 12 kinh mạch chính)
- Survive first minor heavenly tribulation (sống sót thiên kiếp nhỏ đầu tiên)

**Quality Criteria** (Tiêu Chí Chất Lượng):
- **Elements** (Ngũ Hành): Master primary birth element (70%+ affinity), begin learning generating element (Wood→Fire/Mộc→Hỏa, Fire→Earth/Hỏa→Thổ, Earth→Metal/Thổ→Kim, Metal→Water/Kim→Thủy, Water→Wood/Thủy→Mộc)
- **Artifacts** (Pháp Bảo): Jade Purification Bead (Ngọc Tịnh Hóa Châu - cleanses impure qi, +15% condensation efficiency)
- **Alchemy Pills** (Đan Dược): Meridian Cleansing Pill (Tẩy Kinh Đan - removes cultivation impurities)
- **Rituals** (Nghi Thức): Meridian Opening Ceremony (Khai Kinh Đại Pháp - requires full moon alignment)

#### Foundation Establishment Realm (Trúc Cơ Cảnh - Root Formation)
**Description**: The cultivator establishes a solid foundation by forming a qi vortex in their dantian. This realm emphasizes stability and defense against external influences.

**Element Complementarity** (Ngũ Hành Bổ Sung): Strengthen primary element while integrating the generating element from the five elements cycle.

**Advancement Criteria** (Tiêu Chí Tiến Bộ):
- Form stable qi foundation vortex (hình thành xoáy linh khí vững chắc)
- Achieve 80% meridian purity across all channels (đạt 80% độ tinh khiết kinh mạch)
- Demonstrate control over primary element manifestation (thể hiện khả năng khống chế hiện thân ngũ hành chính)

**Quality Criteria** (Tiêu Chí Chất Lượng):
- **Elements** (Ngũ Hành): Primary element (60%+) + generating element (30%+) from five elements cycle
- **Artifacts** (Pháp Bảo): Foundation Stabilizing Cauldron (Trúc Cơ Đỉnh - maintains qi stability during breakthroughs)
- **Alchemy Pills** (Đan Dược): Foundation Solidification Pill (Củng Cơ Đan - strengthens dantian walls)
- **Rituals** (Nghi Thức): Elemental Harmony Ritual (Ngũ Hành Hài Hòa Pháp - balances elemental energies within the body)

#### Core Formation Realm (Kim Đan Cảnh - Power Consolidation)
**Description**: Qi is compressed into a solid core, granting immense power and longevity. This realm introduces the concept of "false cores" vs "true cores."

**Element Complementarity** (Ngũ Hành Bổ Sung): Integrate the controlling element (opposite in the five elements cycle) to achieve elemental balance.

**Advancement Criteria** (Tiêu Chí Tiến Bộ):
- Compress qi into core form (minimum 10,000 qi units) (nén khí thành dạng lõi, tối thiểu 10,000 đơn vị)
- Survive core condensation tribulation (sống sót kiếp nạn ngưng đan)
- Master 3 elemental techniques (thông thạo 3 kỹ thuật ngũ hành)

**Quality Criteria** (Tiêu Chí Chất Lượng):
- **Elements** (Ngũ Hành): Primary + generating + controlling elements balanced (each 25-35% affinity)
- **Artifacts** (Pháp Bảo): Core Formation Furnace (Kim Đan Lô - increases core purity by 25%)
- **Alchemy Pills** (Đan Dược): Core Condensation Pill (Ngưng Đan Đan - facilitates qi compression)
- **Rituals** (Nghi Thức): Five Elements Fusion Ceremony (Ngũ Hành Dung Hợp Pháp - requires rare elemental crystals)

#### Nascent Soul Realm (Nguyên Anh Cảnh - Soul Separation)
**Description**: The cultivator's soul separates from the body, achieving semi-immortality. The nascent soul can survive body destruction and seek new vessels.

**Element Complementarity** (Ngũ Hành Bổ Sung): Achieve harmony between all four elements cultivated so far, preparing for the final element integration.

**Advancement Criteria** (Tiêu Chí Tiến Bộ):
- Separate nascent soul from physical body (tách nguyên anh khỏi thể xác)
- Achieve soul-body synchronization (95% harmony) (đạt đồng bộ hồn-thân 95%)
- Master soul projection techniques (thông thạo kỹ thuật hồn xuất)

**Quality Criteria** (Tiêu Chí Chất Lượng):
- **Elements** (Ngũ Hành): Four elements in harmony (each 20-30% affinity), nascent soul begins absorbing the final element
- **Artifacts** (Pháp Bảo): Soul Nurturing Lamp (Dưỡng Hồn Đăng - protects nascent soul during tribulations)
- **Alchemy Pills** (Đan Dược): Soul Strengthening Elixir (Củng Hồn Đan - enhances soul resilience)
- **Rituals** (Nghi Thức): Soul Separation Ceremony (Ly Hồn Đại Pháp - performed in sacred grounds with master supervision)

#### Divine Transformation Realm (Hóa Thần Cảnh - Divine Evolution)
**Description**: The cultivator undergoes divine transformation, gaining supernatural abilities and divine sense. This realm bridges mortal and immortal cultivation.

**Element Complementarity** (Ngũ Hành Bổ Sung): Complete the five elements cycle by mastering all five elements in perfect divine harmony.

**Advancement Criteria** (Tiêu Chí Tiến Bộ):
- Transform physical body with divine energies (biến hóa thể xác bằng thần lực)
- Attain divine sense (ability to perceive heavenly laws) (có được thần thức, khả năng cảm nhận thiên đạo)
- Master divine-level elemental manipulation (thông thạo khống chế ngũ hành cấp thần)

**Quality Criteria** (Tiêu Chí Chất Lượng):
- **Elements** (Ngũ Hành): Complete five elements cycle - all five elements (Wood/Mộc 木, Metal/Kim 金, Water/Thủy 水, Fire/Hỏa 火, Earth/Thổ 土) in divine fusion (each 18-22% affinity)
- **Artifacts** (Pháp Bảo): Divine Transformation Mirror (Hóa Thần Kính - reflects heavenly tribulations)
- **Alchemy Pills** (Đan Dược): Divine Essence Pill (Thần Tinh Đan - contains heavenly materials)
- **Rituals** (Nghi Thức): Heavenly Baptism Ritual (Thiên Tẩy Đại Pháp - requires heavenly tribulation essence)

#### Void Refinement Realm (Luyện Không Cảnh - Void Mastery)
**Description**: Cultivators refine their being in the void between realms, mastering spatial and temporal laws. This realm involves cultivating karmic alignment, choosing between heavenly and hellish paths.

**Element Complementarity** (Ngũ Hành Bổ Sung): Transcend elemental limitations through karmic cultivation. Choose between Heaven Path (positive karma, light alignment) or Hell Path (negative karma, dark alignment).

**Advancement Criteria** (Tiêu Chí Tiến Bộ):
- Comprehend void laws and spatial manipulation (hiểu thấu luật không gian và khống chế không gian)
- Refine body and soul in void space through karmic trials (tinh luyện thân hồn trong không gian qua thử thách nghiệp lực)
- Achieve void body state (can survive in vacuum) (đạt trạng thái thân không, có thể sống trong chân không)
- Choose and commit to either Heaven or Hell karmic path (chọn và cam kết con đường thiên hoặc địa nghiệp)

**Quality Criteria** (Tiêu Chí Chất Lượng):
- **Elements** (Ngũ Hành): Karmic-attuned elements (elements infused with chosen karmic essence - heavenly light or hellish darkness)
- **Artifacts** (Pháp Bảo): Void Refinement Compass (Luyện Không La Bàn - navigates dimensional boundaries)
- **Alchemy Pills** (Đan Dược): Void Essence Pill (Không Tinh Đan - harvested from void storms, flavored by karmic choice)
- **Rituals** (Nghi Thức): Karmic Alignment Ceremony (Nghiệp Lực Cân Bằng Pháp - performed in void rifts, determines heaven/hell path)

#### Immortal Ascension Realm (Phi Thăng Cảnh - Transcendence)
**Description**: The ultimate realm where cultivators transcend mortal limitations, achieving true immortality and ascending to higher planes of existence.

**Element Complementarity** (Ngũ Hành Bổ Sung): Cultivate one of 3000 Dao paths derived from elemental, combat, and cosmic principles, then merge with the universe.

**Dao Categories** (Các Loại Đạo):
- **Elemental Dao** (Ngũ Hành Đạo - 5 base + derivatives): Water→Ice/Thủy→Băng, Fire→Lightning/Hỏa→Lôi, Earth→Mountain/Thổ→Sơn, Metal→Sword/Kim→Kiếm, Wood→Life/Mộc→Sinh, etc.
- **Combat Dao** (Chiến Đấu Đạo - 3 types): Range Dao (Tầm Xa Đạo - archery, projectiles), Melee Dao (Cận Chiến Đạo - swords, spears), Soul Dao (Hồn Đạo - telekinesis, psychic powers)
- **Cosmic Dao** (Vũ Trụ Đạo - 2 types): Time Dao (Thời Gian Đạo - light manipulation), Space Dao (Không Gian Đạo - darkness control)

**Advancement Criteria** (Tiêu Chí Tiến Bộ):
- Pass final heavenly tribulation (vượt qua thiên kiếp cuối cùng)
- Sever all mortal ties and karma (cắt đứt tất cả ràng buộc phàm tục và nghiệp lực)
- Choose and master one of 3000 Dao paths (chọn và thông thạo một trong 3000 con đường đạo)
- Perform the Great Ascension Ritual (thực hiện Đại Phi Thăng Pháp)
- Achieve unity with the universe (đạt được hòa hợp với vũ trụ)

**Quality Criteria** (Tiêu Chí Chất Lượng):
- **Elements** (Ngũ Hành): Dao-infused elements (elements become manifestations of chosen Dao)
- **Artifacts** (Pháp Bảo): Immortal Ascension Platform (Phi Thăng Đài - facilitates dimensional crossing)
- **Alchemy Pills** (Đan Dược): Immortal Dao Pill (Tiên Đạo Đan - contains essence of chosen Dao path)
- **Rituals** (Nghi Thức): Ascension Ceremony (Phi Thăng Đại Pháp - requires gathering of all previous realm artifacts and Dao comprehension)

### Talent System (Hệ Thống Tài Năng)
- Base talent determined at birth (1-100 scale) (tài năng cơ bản được xác định khi sinh, thang đo 1-100)
- Enhanced through life events (+5-20 talent points) (tăng cường qua các sự kiện đời sống, +5-20 điểm tài năng)
- Carried over through reincarnations with diminishing returns (mang theo qua các kiếp chuyển sinh với lợi ích giảm dần)

## Element Interactions (Tương Tác Ngũ Hành)

### Five Elements Cycle (Chu Kỳ Ngũ Hành)
- **Generating** (Sinh): Wood feeds Fire/Mộc sinh Hỏa, Fire creates Earth/Hỏa sinh Thổ, Earth bears Metal/Thổ sinh Kim, Metal carries Water/Kim sinh Thủy, Water nourishes Wood/Thủy sinh Mộc
- **Controlling** (Khắc): Wood parts Earth/Mộc khắc Thổ, Earth dams Water/Thổ khắc Thủy, Water quenches Fire/Thủy khắc Hỏa, Fire melts Metal/Hỏa khắc Kim, Metal chops Wood/Kim khắc Mộc

### Combat Elemental Effects (Hiệu Ứng Chiến Đấu Ngũ Hành)
- **Buffs** (Buff): Using generating element against opponent (+25% damage) (sử dụng ngũ hành tương sinh với đối thủ, +25% sát thương)
- **Debuffs** (Debuff): Using controlling element against opponent (-25% damage) (sử dụng ngũ hành tương khắc với đối thủ, -25% sát thương)
- **Neutral** (Trung lập): Same element (no modifier) (cùng ngũ hành, không có hiệu ứng)

## Combat System (Hệ Thống Chiến Đấu)

### Battle Resolution (Giải Quyết Trận Chiến)
```typescript
interface CombatResult {
  winner: 'player' | 'enemy';
  damage: number;
  elementalBonus: number;
  criticalHit: boolean;
}
```

### Combat Types (Các Loại Chiến Đấu)
- **Melee** (Cận Chiến): Deterministic damage based on cultivation realm difference (sát thương xác định dựa trên chênh lệch cảnh giới tu luyện)
- **Ranged** (Tầm Xa): Probabilistic with 60-90% hit chance based on skill level (xác suất với tỷ lệ trúng 60-90% dựa trên cấp độ kỹ năng)

## Life Events System (Hệ Thống Sự Kiện Đời Sống)

### Event Categories (Các Loại Sự Kiện)
- **Fortuitous Encounters** (Hào Ngẫu Chi Kiếp): Rare meetings with masters (+cultivation talent) (gặp gỡ hiếm có với các bậc thầy, +tài năng tu luyện)
- **Tribulations** (Kiếp Nạn): Challenges that test resolve (+comprehension ability) (thử thách thử thách ý chí, +khả năng lĩnh ngộ)
- **Karmic Rewards** (Nghiệp Lực Thưởng): Good deeds that accumulate merit points (công đức tích lũy từ việc thiện, tích điểm công đức)
- **Heavenly Tribulations** (Thiên Kiếp): Realm breakthrough challenges (thử thách đột phá cảnh giới)

### Event Persistence (Tính Bền Vững Của Sự Kiện)
- Events modify permanent character attributes (sự kiện sửa đổi thuộc tính nhân vật vĩnh viễn)
- Benefits scale with cultivation realm (lợi ích tỷ lệ với cảnh giới tu luyện)
- Some events unlock unique techniques or artifacts (một số sự kiện mở khóa kỹ thuật hoặc pháp bảo độc đáo)

## Development Patterns (Mô Hình Phát Triển)

### State Management (Quản Lý Trạng Thái)
- Use immutable state updates for game progression (sử dụng cập nhật trạng thái bất biến cho tiến trình trò chơi)
- Separate transient (current life) from persistent (soul) state (tách biệt trạng thái tạm thời (đời hiện tại) với trạng thái vĩnh viễn (hồn linh))
- Validate state transitions to prevent invalid game states (xác thực chuyển đổi trạng thái để ngăn chặn trạng thái trò chơi không hợp lệ)

### Time System (Hệ Thống Thời Gian)
- Implement discrete time ticks (1 tick = 1 day) (triển khai các tick thời gian rời rạc (1 tick = 1 ngày))
- Background progression during player inactivity (tiến trình nền trong thời gian người chơi không hoạt động)
- Time-based events trigger at specific intervals (sự kiện dựa trên thời gian kích hoạt ở các khoảng thời gian cụ thể)

### Randomization (Ngẫu Nhiên Hóa)
- Use seeded random number generation for reproducible outcomes (sử dụng tạo số ngẫu nhiên có hạt giống để có kết quả có thể tái tạo)
- Weight probabilities based on cultivation realm and talent (trọng số xác suất dựa trên cảnh giới tu luyện và tài năng)
- Ensure fair progression curves (đảm bảo đường cong tiến bộ công bằng)

## File Organization (Tổ Chức Tập Tin)
```
src/
├── core/           # Core game systems (cultivation, elements, combat) - Hệ thống trò chơi cốt lõi (tu luyện, ngũ hành, chiến đấu)
├── entities/       # Game entities (player, enemies, artifacts) - Thực thể trò chơi (người chơi, kẻ thù, pháp bảo)
├── events/         # Life events and random encounters - Sự kiện đời sống và gặp gỡ ngẫu nhiên
├── ui/            # User interface components - Thành phần giao diện người dùng
├── utils/         # Game utilities and helpers - Tiện ích và trợ giúp trò chơi
└── types/         # TypeScript type definitions - Định nghĩa kiểu TypeScript
```

## Testing Strategy (Chiến Lược Kiểm Tra)
- Unit tests for individual systems (cultivation math, elemental interactions) (kiểm tra đơn vị cho các hệ thống riêng lẻ (toán tu luyện, tương tác ngũ hành))
- Integration tests for full life cycles and reincarnation (kiểm tra tích hợp cho chu kỳ đời sống đầy đủ và chuyển sinh)
- Property-based testing for combat outcomes and random events (kiểm tra dựa trên thuộc tính cho kết quả chiến đấu và sự kiện ngẫu nhiên)

## Performance Considerations (Cân Nhắc Hiệu Suất)
- Optimize time progression calculations (tối ưu hóa tính toán tiến trình thời gian)
- Cache frequently accessed cultivation formulas (lưu trữ bộ nhớ đệm các công thức tu luyện được truy cập thường xuyên)
- Use efficient data structures for large numbers of artifacts/events (sử dụng cấu trúc dữ liệu hiệu quả cho số lượng lớn pháp bảo/sự kiện)