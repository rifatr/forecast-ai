import { useRef } from 'react';
import type { RefObject } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import { formatDate, getWeatherCondition, isCurrentHour } from '../../lib/weather';
import type { DailyWeather, HourlyWeather } from '../../types/weather';

interface ForecastPanelsProps {
  currentTime: string;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
}

export function ForecastPanels({ currentTime, hourly, daily }: ForecastPanelsProps) {
  const upcomingDays = daily.slice(1, 7);
  const hourlyScrollRef = useRef<HTMLDivElement>(null);
  const dailyScrollRef = useRef<HTMLDivElement>(null);

  function scrollForecast(
    ref: RefObject<HTMLDivElement | null>,
    direction: 'next' | 'previous',
  ) {
    ref.current?.scrollBy({
      left: direction === 'next' ? 420 : -420,
      behavior: 'smooth',
    });
  }

  return (
    <>
      <section className="forecast-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Next up</p>
            <h2>Next 24 hours</h2>
          </div>
          <div className="scroll-controls" aria-label="Hourly forecast controls">
            <button
              type="button"
              className="scroll-button"
              aria-label="Show earlier hours"
              onClick={() => scrollForecast(hourlyScrollRef, 'previous')}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="scroll-button"
              aria-label="Show later hours"
              onClick={() => scrollForecast(hourlyScrollRef, 'next')}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div ref={hourlyScrollRef} className="hourly-scroll">
          {hourly.map((hour) => {
            const condition = getWeatherCondition(hour.weathercode);
            const ConditionIcon = condition.Icon;
            const isCurrent = isCurrentHour(hour.time, currentTime);

            return (
              <article className={`hour-card ${isCurrent ? 'is-now' : ''}`} key={hour.time}>
                <span>{isCurrent ? 'Now' : formatDate(hour.time, { hour: 'numeric' })}</span>
                <ConditionIcon size={27} />
                <strong>{Math.round(hour.temp)}°</strong>
                <small>
                  <Droplets size={12} />
                  {hour.precipitation}%
                </small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel upcoming-forecast">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Plan ahead</p>
            <h2>Next 6 days</h2>
          </div>
          <div className="scroll-controls" aria-label="Daily forecast controls">
            <button
              type="button"
              className="scroll-button"
              aria-label="Show earlier days"
              onClick={() => scrollForecast(dailyScrollRef, 'previous')}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="scroll-button"
              aria-label="Show later days"
              onClick={() => scrollForecast(dailyScrollRef, 'next')}
            >
              <ChevronRight size={18} />
            </button>
            <CalendarDays size={20} />
          </div>
        </div>

        <div ref={dailyScrollRef} className="daily-scroll">
          {upcomingDays.map((day) => {
            const condition = getWeatherCondition(day.weathercode);
            const ConditionIcon = condition.Icon;

            return (
              <article className="daily-card" key={day.date}>
                <div>
                  <strong>{formatDate(day.date, { weekday: 'short' })}</strong>
                  <span>{formatDate(day.date, { month: 'short', day: 'numeric' })}</span>
                </div>
                <ConditionIcon className="daily-condition-icon" size={30} />
                <span className="daily-condition-label">{condition.label}</span>
                <span className="daily-precipitation">
                  <Droplets size={14} />
                  {day.precipitation}%
                </span>
                <div className="daily-temperatures">
                  <span>{Math.round(day.temp_min)}°</span>
                  <strong>{Math.round(day.temp_max)}°</strong>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
