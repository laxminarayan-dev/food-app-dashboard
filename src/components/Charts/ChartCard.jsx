"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TriangleAlert, ChartColumnBig, IndianRupee } from "lucide-react";

/* ===============================
   Empty + Loading Components
================================ */

const EmptyState = React.memo(({ message, icon }) => (
  <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-gray-50 rounded-xl">
    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <p className="text-lg font-semibold text-gray-600 text-center px-4">
      {message}
    </p>
  </div>
));

const LoadingSkeleton = React.memo(() => (
  <div className="w-full h-full animate-pulse bg-gray-100 rounded-xl" />
));

/* ===============================
   Intersection Observer
================================ */

const useIntersectionObserver = (options) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible];
};

const sampleData = (data, maxPoints) => {
  if (!data || data.length <= maxPoints) return data;
  const step = Math.ceil(data.length / maxPoints);
  return data.filter((_, index) => index % step === 0);
};

/* ===============================
   Main Chart Card
================================ */

const ChartCard = ({
  title,
  subtitle,
  type,
  data,
  dataKey,
  categoryKey,
  isLoading = false,
  error = null,
  colors = ["#6366f1", "#16a34a", "#ef4444"],
  maxDataPoints = 100,
}) => {
  const observerOptions = useMemo(
    () => ({ threshold: 0.1, rootMargin: "50px" }),
    [],
  );

  const [containerRef, isVisible] = useIntersectionObserver(observerOptions);

  const [isReadyToRender, setIsReadyToRender] = useState(false);

  const processedData = useMemo(() => {
    return sampleData(data, maxDataPoints);
  }, [data, maxDataPoints]);

  useEffect(() => {
    if (isVisible && !isLoading) {
      const timer = setTimeout(() => {
        setIsReadyToRender(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isLoading]);

  /* ===============================
     Clean Tooltip (OLD UI STYLE)
  ================================ */

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="text-sm bg-slate-50 border border-slate-200 rounded-md p-3">
          <p className=" font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              style={{ color: entry.color }}
              className="font-medium flex items-center text-gray-700"
            >
              {"Total Sales"} : <IndianRupee size={12} />
              {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  /* ===============================
     Chart Renderer
  ================================ */

  const renderChart = useCallback(() => {
    if (!Array.isArray(dataKey) || dataKey.length === 0) {
      return (
        <EmptyState
          message="Chart configuration error."
          icon={<TriangleAlert size={40} />}
        />
      );
    }

    const tickInterval =
      processedData && processedData.length > 10
        ? Math.floor(processedData.length / 7)
        : 0;

    const commonXAxisProps = {
      dataKey: categoryKey,
      stroke: "#6B7280",
      tick: { fontSize: 12 },
      interval: tickInterval,
    };

    const commonYAxisProps = {
      stroke: "#6B7280",
      tick: { fontSize: 12 },
    };

    /* ===== LINE CHART ===== */

    if (type === "line") {
      return (
        <LineChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis {...commonXAxisProps} />
          <YAxis {...commonYAxisProps} />

          {/* 🔥 Remove background hover */}
          <Tooltip content={<CustomTooltip />} cursor={false} />

          {dataKey.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index % colors.length]}
              strokeWidth={3}
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: colors[index % colors.length],
              }}
              activeDot={{
                r: 6,
              }}
            />
          ))}
        </LineChart>
      );
    }

    /* ===== BAR CHART ===== */

    if (type === "bar") {
      return (
        <BarChart
          data={processedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis {...commonXAxisProps} />
          <YAxis {...commonYAxisProps} />

          {/* 🔥 Remove gray hover background */}
          <Tooltip content={<CustomTooltip />} cursor={false} />

          {dataKey.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[index % colors.length]}
              radius={[6, 6, 0, 0]}
            />
          ))}
        </BarChart>
      );
    }

    return (
      <EmptyState
        message="Invalid chart type."
        icon={<TriangleAlert size={40} />}
      />
    );
  }, [processedData, type, dataKey, categoryKey, colors]);

  const renderContent = () => {
    if (isLoading) return <LoadingSkeleton />;
    if (error)
      return <EmptyState message={error} icon={<TriangleAlert size={40} />} />;
    if (!processedData || processedData.length === 0)
      return (
        <EmptyState
          message="No data to display."
          icon={<ChartColumnBig size={40} />}
        />
      );

    if (!isReadyToRender) return <LoadingSkeleton />;

    return (
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    );
  };

  return (
    <div ref={containerRef} className="w-full">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>

        <div className="h-[320px] md:h-[380px]">{renderContent()}</div>
      </div>
    </div>
  );
};

export default React.memo(ChartCard);
