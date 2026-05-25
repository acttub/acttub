import { describe, expect, it } from 'vitest';
import { applyExcerFilters, parseExcerSearchParams, toExcerQueryString, type ExcerRoom } from './excerFilters';

const rooms: ExcerRoom[] = [
  {
    id: '1',
    slug: 'hyehwa',
    name: '혜화 코랄 스튜디오',
    region: '종로구 동숭동',
    subway: ['혜화역'],
    lat: 37.5826,
    lng: 127.0019,
    priceHour: 15000,
    priceNote: null,
    hours: { open: '09:00', close: '24:00', days: [0, 1, 2, 3, 4, 5, 6] },
    phone: '02-000-0001',
    bookingUrl: null,
    photos: [],
    mirror: true,
    soundproof: 'strong',
    sizePyeong: 15,
    lighting: 'bright',
    scriptstand: true,
    microphone: false,
    verifiedAt: new Date('2026-05-01T00:00:00.000Z'),
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-01T00:00:00.000Z'),
    active: true,
  },
  {
    id: '2',
    slug: 'sungshin',
    name: '성신여대 소극장 연습실',
    region: '성북구 동선동',
    subway: ['성신여대입구역'],
    lat: 37.5928,
    lng: 127.0163,
    priceHour: 8000,
    priceNote: null,
    hours: { open: '11:00', close: '22:00', days: [1, 2, 3, 4, 5] },
    phone: '02-000-0005',
    bookingUrl: null,
    photos: [],
    mirror: false,
    soundproof: 'medium',
    sizePyeong: 8,
    lighting: 'dim',
    scriptstand: true,
    microphone: false,
    verifiedAt: new Date('2026-05-10T00:00:00.000Z'),
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-05-10T00:00:00.000Z'),
    active: true,
  },
];

describe('excer filters', () => {
  it('parses valid query filters and ignores invalid values', () => {
    expect(
      parseExcerSearchParams({
        q: ' 혜화 ',
        mirror: '1',
        soundproof: 'weak',
        size: 'xl',
        price_max: '20000',
      }),
    ).toEqual({ q: '혜화', mirror: '1', soundproof: 'weak', price_max: 20000 });
  });

  it('filters rooms by text, mirror, soundproof, size, and price', () => {
    const filters = parseExcerSearchParams({
      q: '성신',
      mirror: '0',
      soundproof: 'medium',
      size: 's',
      price_max: '9000',
    });

    expect(applyExcerFilters(rooms, filters).map((room) => room.slug)).toEqual(['sungshin']);
  });

  it('omits default and empty values from query strings', () => {
    expect(
      toExcerQueryString({
        q: '혜화',
        sort: 'near',
        mirror: undefined,
        price_max: 15000,
      }),
    ).toBe('q=%ED%98%9C%ED%99%94&price_max=15000');
  });
});
